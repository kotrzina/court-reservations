package main

import (
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
	Note     string `json:"note"`
	IsActive bool   `json:"isActive"`
}

type slotOutput struct {
	Date   string `json:"date"`
	Index  int    `json:"index"`
	Status string `json:"status"`
	Owner  string `json:"owner"`
	Note   string `json:"note"`
}

type dayOutput struct {
	Date  string       `json:"date"`
	Slots []slotOutput `json:"slots"`
}

func (app *app) createTimeTableEndpoint(includeDetails bool) gin.HandlerFunc {
	return func(c *gin.Context) {
		type output struct {
			TimeTable         []dayOutput         `json:"timeTable"`
			Reservations      []ReservationOutput `json:"reservations"`
			TodayReservations []ReservationOutput `json:"todayReservations"`
			UserReservations  []ReservationOutput `json:"userReservations"`
		}

		now := time.Now().In(getLocation())
		currentSlot := TimeToSlot(now)
		start := RoundDay(now)
		end := start.Add((time.Duration(app.config.MaxDays) - 1) * 24 * time.Hour)

		// fill empty days with existing reservations
		reservations, _ := app.storage.GetReservationsBetween(start, end)
		days := buildEmptySlots(app.config.StartingSlot, app.config.EndingSlot, app.config.MaxDays)
		for _, r := range reservations {
			for dayIdx, day := range days {
				if r.Date.Format(dateFormat) == day.Date {

					name := ""
					if includeDetails {
						name = r.Name
					}

					// update all slots
					for s := r.SlotFrom; s <= r.SlotTo; s++ {
						days[dayIdx].Slots[s-app.config.StartingSlot].Status = MapSlotStatus(r.Status)
						days[dayIdx].Slots[s-app.config.StartingSlot].Owner = name
						days[dayIdx].Slots[s-app.config.StartingSlot].Note = r.Note

					}
				}
			}
		}

		reservationsOutput := []ReservationOutput{}
		if includeDetails {
			for _, r := range reservations {
				reservationsOutput = append(reservationsOutput, mapReservationOutput(r))
			}
		}

		todayReservationsOutput := []ReservationOutput{}
		if includeDetails {
			for _, r := range reservations {
				if r.Date.Equal(start) && currentSlot <= r.SlotTo {
					todayReservationsOutput = append(todayReservationsOutput, mapReservationOutput(r))
				}
			}
		}

		userReservationsOutput := []ReservationOutput{}
		if includeDetails {
			user, err := app.GetLoggedUser(c)
			if err != nil {
				c.JSON(createHttpError(http.StatusInternalServerError, "could not load user"))
				return
			}
			userReservations, err := app.storage.GetUserActiveReservations(user.Username)
			if err != nil {
				c.JSON(createHttpError(http.StatusInternalServerError, "could not load user reservations"))
				return
			}
			for _, ur := range userReservations {
				userReservationsOutput = append(userReservationsOutput, mapReservationOutput(ur))
			}
		}

		c.JSON(http.StatusOK, output{
			TimeTable:         days,
			Reservations:      reservationsOutput,
			TodayReservations: todayReservationsOutput,
			UserReservations:  userReservationsOutput,
		})
	}
}

func (app *app) getAvailable(c *gin.Context) {
	res := []ReservationOutput{}

	date, err := time.ParseInLocation(dateFormat, c.Param("date"), getLocation())
	if err != nil {
		c.JSON(createHttpError(http.StatusBadRequest, "could not parse date parameter"))
		return
	}
	slot, err := strconv.Atoi(c.Param("firstSlot"))
	if err != nil || slot < app.config.StartingSlot || slot > app.config.EndingSlot {
		c.JSON(createHttpError(http.StatusBadRequest, "could not parse slot parameter"))
		return
	}

	if err = app.checkMaxDays(time.Now().In(getLocation()), date); err != nil {
		c.JSON(createHttpError(http.StatusBadRequest, "day is unavailable"))
		return
	}

	// check today's historical slot
	now := time.Now().In(getLocation())
	if RoundDay(now).Equal(date) {
		currentSlot := TimeToSlot(now)
		if slot < currentSlot {
			// request is ok, but no available slots
			// return empty array
			c.JSON(http.StatusOK, res)
			return
		}
	}

	maxDelta := app.config.MaxFrames
	placedReservations, err := app.storage.GetReservationsBetween(date, date)
	for _, placedReservation := range placedReservations {

		// start is in range of existing reservation
		if slot >= placedReservation.SlotFrom && slot <= placedReservation.SlotTo {
			c.JSON(createHttpError(http.StatusConflict, "existing reservation"))
			return
		}

		if placedReservation.SlotFrom >= slot && slot+app.config.MaxFrames >= placedReservation.SlotFrom {
			maxDelta = placedReservation.SlotFrom - slot
			break
		}
	}

	for s := slot; s <= app.config.EndingSlot && s < slot+maxDelta; s++ {
		res = append(res, ReservationOutput{
			Date:     date.Format(dateFormat),
			SlotFrom: slot,
			SlotTo:   s,
		})
	}

	c.JSON(http.StatusOK, res)
}

func (app *app) postReservation(c *gin.Context) {
	type input struct {
		Date     string `json:"date"`
		SlotFrom int    `json:"slotFrom"`
		SlotTo   int    `json:"slotTo"`
		IsPublic bool   `json:"isPublic"`
		Note     string `json:"note"`
	}

	var request input
	err := c.BindJSON(&request)
	if err != nil {
		c.JSON(createHttpError(http.StatusBadRequest, "could not parse input json"))
		return
	}

	date, err := time.ParseInLocation(dateFormat, request.Date, getLocation())
	if err != nil {
		c.JSON(createHttpError(http.StatusBadRequest, "could not parse reservation date"))
		return
	}

	// validate slot from
	if request.SlotFrom < app.config.StartingSlot || request.SlotFrom > app.config.EndingSlot {
		c.JSON(createHttpError(http.StatusBadRequest, "invalid input for slotFrom"))
		return
	}

	// validate to
	if request.SlotTo < app.config.StartingSlot || request.SlotTo > app.config.EndingSlot {
		c.JSON(createHttpError(http.StatusBadRequest, "invalid input for SlotTo"))
		return
	}

	// validate note
	if len(request.Note) > 150 {
		c.JSON(createHttpError(http.StatusBadRequest, "note is too long"))
		return
	}

	// validate range between slots
	if request.SlotTo-request.SlotFrom >= app.config.MaxFrames {
		c.JSON(createHttpError(http.StatusBadRequest, "invalid slot range"))
		return
	}

	// check current day
	if err = app.checkMaxDays(time.Now().In(getLocation()), date); err != nil {
		c.JSON(createHttpError(http.StatusBadRequest, "day is unavailable"))
		return
	}

	// check historical slots
	now := time.Now().In(getLocation())
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

	// check conflict with all placed reservation in the current day
	placedReservations, err := app.storage.GetReservationsBetween(date, date)
	for _, pr := range placedReservations {
		// check if reservation request is between any existing reservation
		if request.SlotFrom <= pr.SlotTo && request.SlotTo >= pr.SlotFrom {
			c.JSON(createHttpError(http.StatusConflict, "conflict in reservations"))
			return
		}

	}

	user, err := app.GetLoggedUser(c)
	if err != nil {
		c.JSON(createHttpError(http.StatusInternalServerError, "could not read user"))
		return
	}

	status := SlotStatusTaken
	if request.IsPublic {
		status = SlotStatusPublic
	}

	reservation := Reservation{
		Date:     date,
		SlotFrom: request.SlotFrom,
		SlotTo:   request.SlotTo,
		Status:   status,
		Note:     request.Note,
		Username: user.Username,
		Name:     user.Name,
	}

	err = app.storage.CreateReservation(reservation)
	if err != nil {
		c.JSON(createHttpError(http.StatusInternalServerError, "could not create reservation"))
		return
	}

	app.notificationService.ReservationCreated(date, request.SlotFrom, request.SlotTo, user.Name)

	c.JSON(http.StatusOK, struct{}{})
}

func (app *app) postReservationMaintenance(c *gin.Context) {
	type input struct {
		Date     string `json:"date"`
		SlotFrom int    `json:"slotFrom"`
		SlotTo   int    `json:"slotTo"`
		Reason   string `json:"reason"`
	}

	user, err := app.GetLoggedUser(c)
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

	date, err := time.ParseInLocation(dateFormat, request.Date, getLocation())
	if err != nil {
		c.JSON(createHttpError(http.StatusBadRequest, "could not parse reservation date"))
		return
	}

	reservation := Reservation{
		Date:     date,
		SlotFrom: request.SlotFrom,
		SlotTo:   request.SlotTo,
		Status:   SlotStatusMaintenance,
		Username: user.Username,
		Name:     user.Name,
		Note:     "",
	}

	err = app.storage.CreateReservation(reservation)
	if err != nil {
		c.JSON(createHttpError(http.StatusInternalServerError, err.Error()))
		return
	}

	app.notificationService.ReservationCreated(date, request.SlotFrom, request.SlotTo, user.Name)

	c.JSON(http.StatusOK, struct{}{})
}

func (app *app) getAllReservations(c *gin.Context) {
	user, err := app.GetLoggedUser(c)
	if err != nil {
		c.JSON(createHttpError(http.StatusInternalServerError, err.Error()))
		return
	}

	if !user.IsAdmin {
		c.JSON(createHttpError(http.StatusForbidden, "insufficient permissions"))
		return
	}

	res, err := app.storage.GetAllActiveReservations()
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

func (app *app) deleteReservation(c *gin.Context) {
	date, err := time.ParseInLocation(dateFormat, c.Param("date"), getLocation())
	if err != nil {
		c.JSON(createHttpError(http.StatusBadRequest, "could not parse date parameter"))
		return
	}

	slotFrom, err := strconv.Atoi(c.Param("slotFrom"))
	if err != nil || slotFrom < app.config.StartingSlot || slotFrom > app.config.EndingSlot {
		c.JSON(createHttpError(http.StatusBadRequest, "could not parse slot parameter"))
		return
	}

	reservation, err := app.storage.GetReservation(date, slotFrom)
	if err != nil {
		c.JSON(createHttpError(http.StatusNotFound, "reservation does not exist"))
		return
	}

	user, err := app.GetLoggedUser(c)
	if err != nil {
		c.JSON(createHttpError(http.StatusInternalServerError, "could not load logged user"))
		return
	}

	// owner of the reservation or admin
	if reservation.Username != user.Username && !user.IsAdmin {
		c.JSON(createHttpError(http.StatusForbidden, "insufficient permissions"))
		return
	}

	err = app.storage.DeleteReservation(date, slotFrom)
	if err != nil {
		c.JSON(createHttpError(http.StatusInternalServerError, "could not delete reservation"))
		return
	}

	app.notificationService.ReservationDeleted(reservation.Date, reservation.SlotFrom, reservation.SlotTo, user.Name)

	c.JSON(http.StatusOK, struct{}{})
}

func mapReservationOutput(r Reservation) ReservationOutput {

	return ReservationOutput{
		Date:     r.Date.Format(dateFormat),
		SlotFrom: r.SlotFrom,
		SlotTo:   r.SlotTo,
		Name:     r.Name,
		Username: r.Username,
		Note:     r.Note,
		IsActive: r.IsActive(),
	}
}

// buildEmptySlots builds the structure of a slot for every single day
// nDays - how many days ahead should be prepared
func buildEmptySlots(firstSlot, endSlot, nDays int) []dayOutput {
	now := time.Now().In(getLocation())
	currentSlot := TimeToSlot(now)
	start := RoundDay(now)

	days := make([]dayOutput, nDays-1)
	current := start
	for d := 0; d < nDays-1; d++ {
		slots := []slotOutput{}
		for s := firstSlot; s <= endSlot; s++ {
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
				Note:   "",
			})
		}

		days[d] = dayOutput{
			Date:  current.Format(dateFormat),
			Slots: slots,
		}

		current = current.Add(24 * time.Hour)
	}

	return days
}
