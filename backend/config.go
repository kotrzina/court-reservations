package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Config struct {
	MaxDays          int // you can do a reservation MaxDays ahead
	MaxFrames        int // one frame = 15 min; e.g. when MaxFrames is 8 that means maximal reservation frame could be two hours
	StartingSlot     int // first slot of the day
	EndingSlot       int // last slot of the day
	JwtSigningKey    string
	RegistrationCode string
	Admins           []string
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
	maxFrames := 4 // default value
	if maxFramesEnv != "" {
		maxFrames, err = strconv.Atoi(maxFramesEnv)
		if err != nil {
			return nil, fmt.Errorf("could not parse MAX_FRAMES environment variable: %w", err)
		}
	}

	startingSlotEnv := os.Getenv("SLOT_START")
	startingSlot := 12 // 6:00
	if startingSlotEnv != "" {
		startingSlot, err = strconv.Atoi(startingSlotEnv)
		if err != nil {
			return nil, fmt.Errorf("could not parse SLOT_START environment variable: %w", err)
		}
	}

	endingSlotEnv := os.Getenv("SLOT_END")
	endingSlot := 43 // 21:45
	if endingSlotEnv != "" {
		endingSlot, err = strconv.Atoi(endingSlotEnv)
		if err != nil {
			return nil, fmt.Errorf("could not parse SLOT_END environment variable: %w", err)
		}
	}

	jwt := os.Getenv("JWT_SIGNING_KEY")
	if jwt == "" {
		fmt.Println("[WARNING] Using default JWT_SIGNING_KEY")
		jwt = "test" // default  value
	}

	registrationCode := os.Getenv("REGISTRATION_CODE")
	if registrationCode == "" {
		fmt.Println("[WARNING] Using default REGISTRATION_CODE")
		registrationCode = "test"
	}

	admins := []string{}
	adminsEnv := os.Getenv("ADMINS") // comma separated list of usernames
	if adminsEnv != "" {
		admins = strings.Split(adminsEnv, ",")
	}

	return &Config{
		MaxDays:          maxDays,
		MaxFrames:        maxFrames,
		StartingSlot:     startingSlot,
		EndingSlot:       endingSlot,
		JwtSigningKey:    jwt,
		RegistrationCode: registrationCode,
		Admins:           admins,
	}, nil
}
