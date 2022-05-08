package main

import (
	"github.com/stretchr/testify/assert"
	"testing"
	"time"
)

func TestTimeToSlot(t *testing.T) {
	assert.Equal(t, 0, TimeToSlot(time.Date(2000, 1, 1, 0, 0, 0, 0, getPrague())))
	assert.Equal(t, 0, TimeToSlot(time.Date(2000, 1, 1, 0, 14, 0, 0, getPrague())))
	assert.Equal(t, 1, TimeToSlot(time.Date(2000, 1, 1, 0, 30, 0, 0, getPrague())))
	assert.Equal(t, 47, TimeToSlot(time.Date(2000, 1, 1, 23, 59, 0, 0, getPrague())))
}

func TestRoundDay(t *testing.T) {
	assert.Equal(t, time.Date(2000, 9, 25, 0, 0, 0, 0, getPrague()), RoundDay(time.Date(2000, 9, 25, 23, 4, 12, 7, getPrague())))
	assert.Equal(t, time.Date(2010, 9, 25, 0, 0, 0, 0, getPrague()), RoundDay(time.Date(2010, 9, 25, 0, 0, 0, 0, getPrague())))
}
