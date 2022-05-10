package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"time"
)

type ReservationOutput struct {
	Date     string `json:"date"`
	SlotFrom int    `json:"slotFrom,omitempty"`
	SlotTo   int    `json:"slotTo,omitempty"`
	Name     string `json:"name,omitempty"`
	Username string `json:"username,omitempty"`
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
			TimeTable         []dayOutput         `json:"timeTable"`
			TodayReservations []ReservationOutput `json:"todayReservations"`
			UserReservations  []ReservationOutput `json:"userReservations"`
		}

		now := time.Now()
		currentSlot := TimeToSlot(now)
		start := RoundDay(now)
		end := start.Add((time.Duration(srv.config.MaxDays) - 1) * 24 * time.Hour)

		days := make([]dayOutput, srv.config.MaxDays-1)
		current := start
		for d := 0; d < srv.config.MaxDays-1; d++ {
			slots := []slotOutput{}
			for s := srv.config.StartingSlot; s <= srv.config.EndingSlot; s++ {
				status := MapSlotStatus(SlotStatusFree)
				if d == 0 && s <= currentSlot {
					// today in pass
					status = MapSlotStatus(SlotStatusHistory)
				}

				slots = append(slots, slotOutput{
					Date:   current.Format(dateFormat),
					Index:  s,
					Status: status,
					Owner:  "",
				})
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
						days[dayIdx].Slots[s-srv.config.StartingSlot].Status = MapSlotStatus(r.Status)
						days[dayIdx].Slots[s-srv.config.StartingSlot].Owner = name

					}
				}
			}
		}

		today := []ReservationOutput{}
		if includeDetails {
			for _, r := range reservations {
				if r.Date.Equal(start) && currentSlot <= r.SlotTo {
					today = append(today, mapReservationOutput(r))
				}
			}
		}

		userRes := []ReservationOutput{}
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
				userRes = append(userRes, mapReservationOutput(ur))
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
	date, err := time.ParseInLocation(dateFormat, c.Param("date"), getPrague())
	if err != nil {
		c.JSON(createHttpError(http.StatusBadRequest, "could not parse date parameter"))
		return
	}
	slot, err := strconv.Atoi(c.Param("firstSlot"))
	if err != nil || slot < srv.config.StartingSlot || slot > srv.config.EndingSlot {
		c.JSON(createHttpError(http.StatusBadRequest, "could not parse slot parameter"))
		return
	}

	if err = srv.checkMaxDays(time.Now(), date); err != nil {
		c.JSON(createHttpError(http.StatusBadRequest, "day is unavailable"))
		return
	}

	maxDelta := srv.config.MaxFrames
	placedReservations, err := srv.storage.GetReservationsBetween(date, date)
	for _, placedReservation := range placedReservations {

		// start is in range of existing reservation
		if slot >= placedReservation.SlotFrom && slot <= placedReservation.SlotTo {
			c.JSON(createHttpError(http.StatusConflict, "existing reservation"))
			return
		}

		if placedReservation.SlotFrom >= slot && slot+srv.config.MaxFrames >= placedReservation.SlotFrom {
			maxDelta = placedReservation.SlotFrom - slot
			break
		}
	}

	ress := []ReservationOutput{}
	for s := slot; s <= srv.config.EndingSlot && s < slot+maxDelta; s++ {
		ress = append(ress, ReservationOutput{
			Date:     date.Format(dateFormat),
			SlotFrom: slot,
			SlotTo:   s,
		})
	}

	c.JSON(http.StatusOK, ress)
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
	if request.SlotFrom < srv.config.StartingSlot || request.SlotFrom > srv.config.EndingSlot {
		c.JSON(createHttpError(http.StatusBadRequest, "invalid input for slotFrom"))
		return
	}

	// validate to
	if request.SlotTo < srv.config.StartingSlot || request.SlotTo > srv.config.EndingSlot {
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
	placedReservations, err := srv.storage.GetReservationsBetween(date, date)
	for _, pr := range placedReservations {
		// check if reservation request is between any existing reservation
		if request.SlotFrom <= pr.SlotTo && request.SlotTo >= pr.SlotFrom {
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

func (srv *Server) postReservationMaintenance(c *gin.Context) {
	type input struct {
		Date     string `json:"date"`
		SlotFrom int    `json:"slotFrom"`
		SlotTo   int    `json:"slotTo"`
		Reason   string `json:"reason"`
	}

	user, err := srv.GetLoggedUser(c)
	if err != nil {
		c.JSON(createHttpError(http.StatusInternalServerError, err.Error()))
		return
	}

	if !user.IsAdmin {
		c.JSON(createHttpError(http.StatusForbidden, "insufficient permissions"))
		return
	}

	var request input
	err = c.BindJSON(&request)
	if err != nil {
		c.JSON(createHttpError(http.StatusBadRequest, "could not parse input json"))
		return
	}

	date, err := time.ParseInLocation(dateFormat, request.Date, getPrague())
	if err != nil {
		c.JSON(createHttpError(http.StatusBadRequest, "could not parse reservation date"))
		return
	}

	err = srv.storage.CreateReservation(date, request.SlotFrom, request.SlotTo, SlotStatusMaintenance, user.Username, request.Reason)
	if err != nil {
		c.JSON(createHttpError(http.StatusInternalServerError, err.Error()))
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

	items := []ReservationOutput{}
	for _, r := range res {
		items = append(items, mapReservationOutput(r))
	}

	c.JSON(http.StatusOK, items)
}

func (srv *Server) deleteReservation(c *gin.Context) {
	date, err := time.ParseInLocation(dateFormat, c.Param("date"), getPrague())
	if err != nil {
		c.JSON(createHttpError(http.StatusBadRequest, "could not parse date parameter"))
		return
	}

	slotFrom, err := strconv.Atoi(c.Param("slotFrom"))
	if err != nil || slotFrom < srv.config.StartingSlot || slotFrom > srv.config.EndingSlot {
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

func mapReservationOutput(r Reservation) ReservationOutput {
	return ReservationOutput{
		Date:     r.Date.Format(dateFormat),
		SlotFrom: r.SlotFrom,
		SlotTo:   r.SlotTo,
		Name:     r.Name,
		Username: r.Username,
	}
}

func (srv *Server) checkMaxDays(now, reservation time.Time) error {
	if RoundDay(now).Add((time.Duration(srv.config.MaxDays) - 1) * 24 * time.Hour).Before(RoundDay(reservation)) {
		return fmt.Errorf("max days check failed")
	}
	return nil
}
