package main

import (
	"github.com/sirupsen/logrus"
	"time"
)

type Notification interface {
	ReservationCreated(date time.Time, slotFrom, slotTo int, name string) error
	ReservationDeleted(date time.Time, slotFrom, slotTo int, name string) error
}

type NotificationService struct {
	channels []Notification
	logger   *logrus.Logger
}

func NewNotificationService(c *config, l *logrus.Logger) *NotificationService {
	return &NotificationService{
		channels: BuildNotifications(c),
		logger:   l,
	}
}

func (n *NotificationService) ReservationCreated(date time.Time, slotFrom, slotTo int, name string) {
	for _, ch := range n.channels {
		err := ch.ReservationCreated(date, slotFrom, slotTo, name)
		if err != nil {
			n.logger.Errorf("could not send notification: %s", err)
		}
	}
}
func (n *NotificationService) ReservationDeleted(date time.Time, slotFrom, slotTo int, name string) {
	for _, ch := range n.channels {
		err := ch.ReservationDeleted(date, slotFrom, slotTo, name)
		if err != nil {
			n.logger.Errorf("could not send notification: %s", err)
		}
	}
}

func BuildNotifications(c *config) []Notification {
	n := []Notification{}

	if c.NotificationDiscord != "" {
		n = append(n, &Discord{hookUrl: c.NotificationDiscord})
	}

	return n
}
