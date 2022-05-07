package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"time"
)

type reservationItem struct {
	Date     string `json:"date"`
	SlotFrom int    `json:"slotFrom,omitempty"`
	SlotTo   int    `json:"slotTo,omitempty"`
	Owner    string `json:"owner"`
}

func (srv *Server) createTimeTableEndpoint(includeDetails bool) gin.HandlerFunc {
	return func(c *gin.Context) {
		type slotOutput struct {
			Date   string `json:"date"`
			Index  int    `json:"index"`
			Status string `json:"status"`
			Owner  string `json:"owner"`
		}

		type dayOutput struct {
			Date  string       `json:"date"`
			Slots []slotOutput `json:"slots"`
		}

		type output struct {
			TimeTable         []dayOutput       `json:"timeTable"`
			TodayReservations []reservationItem `json:"todayReservations"`
			UserReservations  []reservationItem `json:"userReservations"`
		}

		now := time.Now()
		currentSlot := TimeToSlot(now)
		start := RoundDay(now)
		end := start.Add((time.Duration(srv.config.MaxDays) - 1) * 24 * time.Hour)

		days := make([]dayOutput, srv.config.MaxDays-1)
		current := start
		for d := 0; d < srv.config.MaxDays-1; d++ {
			slots := make([]slotOutput, 96)
			for s := 0; s < 96; s++ {

				status := MapSlotStatus(SlotStatusFree)
				if d == 0 && s <= currentSlot {
					// today in pass
					status = MapSlotStatus(SlotStatusHistory)
				}

				slots[s] = slotOutput{
					Date:   current.Format(dateFormat),
					Index:  s,
					Status: status,
					Owner:  "",
				}
			}

			days[d] = dayOutput{
				Date:  current.Format(dateFormat),
				Slots: slots,
			}

			current = current.Add(24 * time.Hour)
		}

		// update slot statuses
		reservations, _ := srv.storage.GetReservationsBetween(start, end)
		for _, r := range reservations {
			for dayIdx, day := range days {
				if r.Date.Format(dateFormat) == day.Date {

					name := ""
					if includeDetails {
						name = r.Name
					}

					// update all slots
					for s := r.SlotFrom; s <= r.SlotTo; s++ {
						days[dayIdx].Slots[s].Status = MapSlotStatus(r.Status)
						days[dayIdx].Slots[s].Owner = name

					}
				}
			}
		}

		today := []reservationItem{}
		if includeDetails {
			for _, r := range reservations {
				if currentSlot <= r.SlotTo {
					today = append(today, mapReservationItem(r))
				}
			}
		}

		userRes := []reservationItem{}
		if includeDetails {
			user, err := srv.GetLoggedUser(c)
			if err != nil {
				c.JSON(createHttpError(http.StatusInternalServerError, "could not load user"))
				return
			}
			userReservations, err := srv.storage.GetUserActiveReservations(user.Username)
			if err != nil {
				c.JSON(createHttpError(http.StatusInternalServerError, "could not load user reservations"))
				return
			}
			for _, ur := range userReservations {
				userRes = append(userRes, mapReservationItem(ur))
			}
		}

		c.JSON(http.StatusOK, output{
			TimeTable:         days,
			TodayReservations: today,
			UserReservations:  userRes,
		})
	}
}

func (srv *Server) getAvailable(c *gin.Context) {
	type reservationOutput struct {
		Date     string `json:"date"`
		SlotFrom int    `json:"slotFrom"`
		SlotTo   int    `json:"slotTo"`
	}

	type output struct {
		Possibilities []reservationOutput `json:"possibilities"`
	}

	date, err := time.ParseInLocation("2006-01-02", c.Param("date"), getPrague())
	if err != nil {
		c.JSON(createHttpError(http.StatusBadRequest, "could not parse date parameter"))
		return
	}
	firstSlot, err := strconv.Atoi(c.Param("firstSlot"))
	if err != nil || firstSlot < 0 || firstSlot > 95 {
		c.JSON(createHttpError(http.StatusBadRequest, "could not parse slot parameter"))
		return
	}

	if err = srv.checkMaxDays(time.Now(), date); err != nil {
		c.JSON(createHttpError(http.StatusBadRequest, "day is unavailable"))
		return
	}

	maxDelta := 8
	placedReservations, err := srv.storage.GetReservationsBetween(date, date.Add(24*time.Hour))
	for _, placedReservation := range placedReservations {

		// start is in range of existing reservation
		if firstSlot >= placedReservation.SlotFrom && firstSlot <= placedReservation.SlotTo {
			c.JSON(createHttpError(http.StatusConflict, "existing reservation"))
			return
		}

		if placedReservation.SlotFrom >= firstSlot && firstSlot+srv.config.MaxFrames >= placedReservation.SlotFrom {
			maxDelta = placedReservation.SlotFrom - firstSlot
		}
	}

	ress := []reservationOutput{}
	for s := firstSlot; s <= 95 && s < firstSlot+maxDelta; s++ {
		ress = append(ress, reservationOutput{
			Date:     date.Format(dateFormat),
			SlotFrom: firstSlot,
			SlotTo:   s,
		})
	}

	c.JSON(http.StatusOK, output{Possibilities: ress})
}

func (srv *Server) postReservation(c *gin.Context) {
	type input struct {
		Date     string `json:"date"`
		SlotFrom int    `json:"slotFrom"`
		SlotTo   int    `json:"slotTo"`
	}

	var request input
	err := c.BindJSON(&request)
	if err != nil {
		c.JSON(createHttpError(http.StatusBadRequest, "could not parse input json"))
		return
	}

	date, err := time.ParseInLocation(dateFormat, request.Date, getPrague())
	if err != nil {
		c.JSON(createHttpError(http.StatusBadRequest, "could not parse reservation date"))
		return
	}

	// validate slot from
	if request.SlotFrom < 0 || request.SlotFrom > 95 {
		c.JSON(createHttpError(http.StatusBadRequest, "invalid input for slotFrom"))
		return
	}

	// validate to
	if request.SlotTo < 0 || request.SlotTo > 95 {
		c.JSON(createHttpError(http.StatusBadRequest, "invalid input for SlotTo"))
		return
	}

	// validate range between slots
	if request.SlotTo-request.SlotFrom >= srv.config.MaxFrames {
		c.JSON(createHttpError(http.StatusBadRequest, "invalid slot range"))
		return
	}

	// check current day
	if err = srv.checkMaxDays(time.Now(), date); err != nil {
		c.JSON(createHttpError(http.StatusBadRequest, "day is unavailable"))
		return
	}

	// check historical slots
	now := time.Now()
	if RoundDay(now).After(date) {
		c.JSON(createHttpError(http.StatusBadRequest, "could not reserve historic slot"))
		return
	}

	// check today historical slot
	if RoundDay(now).Equal(date) {
		currentSlot := TimeToSlot(now)
		if request.SlotFrom < currentSlot {
			c.JSON(createHttpError(http.StatusBadRequest, "could not reserve historic slot"))
			return
		}
	}

	// check conflict with all placed reservation iin the current day
	placedReservations, err := srv.storage.GetReservationsBetween(date, date.Add(24*time.Hour))
	for _, pr := range placedReservations {
		// check if reservation request is between any existing reservation
		if request.SlotFrom >= pr.SlotFrom && request.SlotFrom <= pr.SlotTo ||
			request.SlotTo >= pr.SlotFrom && request.SlotTo <= pr.SlotTo {
			c.JSON(createHttpError(http.StatusConflict, "conflict in reservations"))
			return
		}

	}

	user, err := srv.GetLoggedUser(c)
	if err != nil {
		c.JSON(createHttpError(http.StatusInternalServerError, "could not read user"))
		return
	}

	err = srv.storage.CreateReservation(date, request.SlotFrom, request.SlotTo, SlotStatusTaken, user.Username, user.Name)
	if err != nil {
		c.JSON(createHttpError(http.StatusInternalServerError, "could not create reservation"))
		return
	}

	c.JSON(http.StatusOK, struct{}{})
}

func (srv *Server) getAllReservations(c *gin.Context) {
	user, err := srv.GetLoggedUser(c)
	if err != nil {
		c.JSON(createHttpError(http.StatusInternalServerError, err.Error()))
		return
	}

	if !user.IsAdmin {
		c.JSON(createHttpError(http.StatusForbidden, "insufficient permissions"))
		return
	}

	res, err := srv.storage.GetAllActiveReservations()
	if err != nil {
		c.JSON(createHttpError(http.StatusInternalServerError, err.Error()))
		return
	}

	items := []reservationItem{}
	for _, r := range res {
		items = append(items, mapReservationItem(r))
	}

	c.JSON(http.StatusOK, items)
}

func (srv *Server) deleteReservation(c *gin.Context) {
	date, err := time.ParseInLocation("2006-01-02", c.Param("date"), getPrague())
	if err != nil {
		c.JSON(createHttpError(http.StatusBadRequest, "could not parse date parameter"))
		return
	}

	slotFrom, err := strconv.Atoi(c.Param("slotFrom"))
	if err != nil || slotFrom < 0 || slotFrom > 95 {
		c.JSON(createHttpError(http.StatusBadRequest, "could not parse slot parameter"))
		return
	}

	reservation, err := srv.storage.GetReservation(date, slotFrom)
	if err != nil {
		c.JSON(createHttpError(http.StatusNotFound, "reservation does not exist"))
		return
	}

	user, err := srv.GetLoggedUser(c)
	if err != nil {
		c.JSON(createHttpError(http.StatusInternalServerError, "could not load logged user"))
		return
	}

	// owner of the reservation or admin
	if reservation.Username != user.Username && !user.IsAdmin {
		c.JSON(createHttpError(http.StatusForbidden, "insufficient permissions"))
		return
	}

	err = srv.storage.DeleteReservation(date, slotFrom)
	if err != nil {
		c.JSON(createHttpError(http.StatusInternalServerError, "could not delete reservation"))
		return
	}

	c.JSON(http.StatusOK, struct{}{})
}

func mapReservationItem(r Reservation) reservationItem {
	return reservationItem{
		Date:     r.Date.Format(dateFormat),
		SlotFrom: r.SlotFrom,
		SlotTo:   r.SlotTo,
		Owner:    r.Name,
	}
}

func (srv *Server) checkMaxDays(now, reservation time.Time) error {
	if RoundDay(now).Add((time.Duration(srv.config.MaxDays) - 1) * 24 * time.Hour).Before(RoundDay(reservation)) {
		return fmt.Errorf("max days check failed")
	}
	return nil
}
