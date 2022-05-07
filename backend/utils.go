package main

import "time"

const dateFormat = "2006-01-02"

func TimeToSlot(t time.Time) int {
	h := t.Hour()
	m := t.Minute()

	return h*2 + m/30
}

func MapSlotStatus(status int) string {
	mapping := map[int]string{
		SlotStatusFree:        "free",
		SlotStatusTaken:       "taken",
		SlotStatusMaintenance: "maintenance",
		SlotStatusHistory:     "history",
	}

	res, found := mapping[status]
	if found {
		return res
	}

	return "unknown"
}

func RoundDay(t time.Time) time.Time {
	return time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, getPrague())
}

func getPrague() *time.Location {
	prg, _ := time.LoadLocation("Europe/Prague")
	return prg
}
