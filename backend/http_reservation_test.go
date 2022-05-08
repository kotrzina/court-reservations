package main

import (
	"github.com/stretchr/testify/assert"
	"testing"
	"time"
)

func TestCheckMaxDays(t *testing.T) {
	s := NewServer(nil, &Config{
		MaxDays:   14, // max 14 days ahead
		MaxFrames: 0,
	}, nil, nil, 1234)
	now := time.Date(2000, 1, 1, 12, 0, 0, 0, getPrague())

	assert.Nil(t, s.checkMaxDays(now, time.Date(2000, 1, 2, 12, 0, 0, 0, getPrague())))
	assert.Nil(t, s.checkMaxDays(now, time.Date(2000, 1, 5, 12, 0, 0, 0, getPrague())))
	assert.Nil(t, s.checkMaxDays(now, time.Date(2000, 1, 14, 12, 0, 0, 0, getPrague())))
	assert.Error(t, s.checkMaxDays(now, time.Date(2000, 1, 15, 12, 0, 0, 0, getPrague())))
	assert.Error(t, s.checkMaxDays(now, time.Date(2000, 2, 1, 12, 0, 0, 0, getPrague())))
	assert.Error(t, s.checkMaxDays(now, time.Date(2001, 1, 1, 12, 0, 0, 0, getPrague())))
}
