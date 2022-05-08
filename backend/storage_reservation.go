package main

import (
	"context"
	"fmt"
	"sort"
	"time"
)

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
	id := calculateReservationId(date, slotFrom)
	_, err := s.client.Collection(s.config.CollectionReservations).Doc(id).Set(ctx, data)
	if err != nil {
		s.logger.Error(err)
	}

	return err
}

func (s *Storage) GetReservation(date time.Time, slotFrom int) (Reservation, error) {
	id := calculateReservationId(date, slotFrom)
	ctx := context.Background()
	doc, err := s.client.Collection(s.config.CollectionReservations).Doc(id).Get(ctx)
	if err != nil {
		s.logger.Error(err)
		return Reservation{}, err
	}
	return mapReservation(doc.Data()), nil
}

func (s *Storage) GetReservationsBetween(from, to time.Time) ([]Reservation, error) {
	ctx := context.Background()
	docs, err := s.client.Collection(s.config.CollectionReservations).
		Where("date", ">=", from).
		Where("date", "<=", to).
		Documents(ctx).
		GetAll()

	if err != nil {
		s.logger.Error(err)
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
			return r2.SlotFrom > r1.SlotFrom
		}

		return false
	})

	return reservations, nil
}

func (s *Storage) GetUserActiveReservations(username string) ([]Reservation, error) {
	ctx := context.Background()
	today := RoundDay(time.Now())
	docs, err := s.client.Collection(s.config.CollectionReservations).
		Where("username", "==", username).
		Where("date", ">=", today).
		Documents(ctx).
		GetAll()

	if err != nil {
		s.logger.Error(err)
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
		if r2.Date.After(r1.Date) {
			return true
		}

		// sort slots in same day
		if r1.Date.Unix() == r2.Date.Unix() {
			return r2.SlotFrom > r1.SlotFrom
		}

		return false
	})

	return reservations, nil
}

func (s *Storage) GetAllActiveReservations() ([]Reservation, error) {
	ctx := context.Background()
	today := RoundDay(time.Now())
	docs, err := s.client.Collection(s.config.CollectionReservations).
		Where("date", ">=", today).
		Documents(ctx).
		GetAll()

	if err != nil {
		s.logger.Error(err)
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
		if r2.Date.After(r1.Date) {
			return true
		}

		// sort slots in same day
		if r1.Date.Unix() == r2.Date.Unix() {
			return r2.SlotFrom > r1.SlotFrom
		}

		return false
	})

	return reservations, nil
}

func (s *Storage) DeleteReservation(date time.Time, slotFrom int) error {
	id := calculateReservationId(date, slotFrom)
	ctx := context.Background()
	_, err := s.client.Collection(s.config.CollectionReservations).Doc(id).Delete(ctx)
	if err != nil {
		s.logger.Error(err)
	}
	return err
}

func calculateReservationId(date time.Time, slotFrom int) string {
	return fmt.Sprintf("%s-%d", RoundDay(date).Format(dateFormat), slotFrom)
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
