package main

import (
	"context"
	"fmt"
	"sort"
	"time"
)

const colReservation = "reservation"

const (
	SlotStatusFree        = 0
	SlotStatusTaken       = 1
	SlotStatusMaintenance = 2
	SlotStatusHistory     = 3
	SlotStatusUnknown     = 4
)

type Reservation struct {
	Date     time.Time
	SlotFrom int
	SlotTo   int
	Status   int // reservation status
	Username string
	Name     string
}

func (s *Storage) CreateReservation(date time.Time, slotFrom, slotTo, status int, username, name string) error {
	data := map[string]interface{}{
		"date":     date,
		"slotFrom": slotFrom,
		"slotTo":   slotTo,
		"status":   status,
		"username": username,
		"name":     name,
	}

	ctx := context.Background()
	id := fmt.Sprintf("%s-%d", date.Format(dateFormat), slotFrom)
	_, err := s.client.Collection(colReservation).Doc(id).Set(ctx, data)

	return err
}

func (s *Storage) GetReservationsBetween(from, to time.Time) ([]Reservation, error) {
	ctx := context.Background()
	docs, err := s.client.Collection(colReservation).
		Where("date", ">=", from).
		Where("date", "<=", to).
		Documents(ctx).
		GetAll()

	if err != nil {
		return nil, err
	}

	reservations := []Reservation{}
	for _, doc := range docs {
		reservations = append(reservations, mapReservation(doc.Data()))
	}

	sort.SliceStable(reservations, func(i, j int) bool {
		r1 := reservations[i]
		r2 := reservations[j]

		// sort days
		if r2.Date.Before(r1.Date) {
			return true
		}

		// sort slots in same day
		if r1.Date.Unix() == r2.Date.Unix() {
			return r2.SlotFrom < r1.SlotFrom
		}

		return false
	})

	return reservations, nil
}

func mapReservation(data map[string]interface{}) Reservation {
	return Reservation{
		Date:     data["date"].(time.Time).In(getPrague()),
		SlotFrom: int(data["slotFrom"].(int64)),
		SlotTo:   int(data["slotTo"].(int64)),
		Status:   int(data["status"].(int64)),
		Username: data["username"].(string),
		Name:     data["name"].(string),
	}
}
