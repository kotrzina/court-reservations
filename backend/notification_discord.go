package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type Discord struct {
	hookUrl string
}

func (d *Discord) ReservationCreated(date time.Time, slotFrom, slotTo int, name string) error {
	t := fmt.Sprintf("%s - %s", SlotToTime(slotFrom), SlotToTime(slotTo+1))
	msg := fmt.Sprintf("__**Reservation created**__\n**Date:** %s\n**Time:** %s\n**User:** %s", date.Format(dateFormat), t, name)
	return d.sendWebhook(msg)
}
func (d *Discord) ReservationDeleted(date time.Time, slotFrom, slotTo int, name string) error {
	t := fmt.Sprintf("%s - %s", SlotToTime(slotFrom), SlotToTime(slotTo+1))
	msg := fmt.Sprintf("__**Reservation deleted**__\n**Date:** %s\n**Time:** %s\n**User:** %s", date.Format(dateFormat), t, name)
	return d.sendWebhook(msg)
}

func (d *Discord) sendWebhook(message string) error {
	body := struct {
		Content string `json:"content"`
	}{
		Content: message,
	}

	jsonData, err := json.Marshal(body)
	if err != nil {
		return fmt.Errorf("could not marshal data for Discord webhook")
	}
	data := bytes.NewBuffer(jsonData)

	resp, err := http.Post(d.hookUrl, "application/json", data)
	if err != nil {
		return fmt.Errorf("could not send Discord webhook: %w", err)
	}

	if resp.StatusCode != http.StatusNoContent {
		return fmt.Errorf("invalid response code from Discord webhook: %d", resp.StatusCode)
	}

	return nil
}
