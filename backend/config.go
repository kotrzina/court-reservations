package main

import (
	"fmt"
	"os"
	"strconv"
)

type Config struct {
	MaxDays   int // you can do a reservation MaxDays ahead
	MaxFrames int // one frame = 15 min; e.g. when MaxFrames is 8 that means maximal reservation frame could be two hours
}

func LoadConfig() (*Config, error) {
	var err error

	maxDaysEnv := os.Getenv("MAX_DAYS")
	maxDays := 14 // default value
	if maxDaysEnv != "" {
		maxDays, err = strconv.Atoi(maxDaysEnv)
		if err != nil {
			return nil, fmt.Errorf("could not parse MAX_DAYS environment variable: %w", err)
		}
	}

	maxFramesEnv := os.Getenv("MAX_FRAMES")
	maxFrames := 8 // default value
	if maxFramesEnv != "" {
		maxFrames, err = strconv.Atoi(maxFramesEnv)
		if err != nil {
			return nil, fmt.Errorf("could not parse MAX_FRAMES environment variable: %w", err)
		}
	}

	return &Config{
		MaxDays:   maxDays,
		MaxFrames: maxFrames,
	}, nil
}
