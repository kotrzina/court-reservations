package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Config struct {
	Port                   int    //application port
	GoogleProjectId        string // firestore collection
	CollectionReservations string // firestore collection
	CollectionUsers        string // firestore collection
	MaxDays                int    // you can do a reservation MaxDays ahead
	MaxFrames              int    // one frame = 15 min; e.g. when MaxFrames is 8 that means maximal reservation frame could be two hours
	StartingSlot           int    // first slot of the day
	EndingSlot             int    // last slot of the day
	JwtSigningKey          string
	RegistrationCode       string
	Admins                 []string
	NotificationDiscord    string
}

func LoadConfig() *Config {
	admins := []string{}
	adminsEnv := os.Getenv("ADMINS") // comma separated list of usernames
	if adminsEnv != "" {
		admins = strings.Split(adminsEnv, ",")
	}

	return &Config{
		Port:                   getEnvIntWithDefault("PORT", 8081),
		GoogleProjectId:        getEnvStringWithDefault("GOOGLE_PROJECT_ID", "test"),
		CollectionReservations: getEnvStringWithDefault("FIRESTORE_COLLECTION_RESERVATIONS", "reservations"),
		CollectionUsers:        getEnvStringWithDefault("FIRESTORE_COLLECTION_USERS", "users"),
		MaxDays:                getEnvIntWithDefault("MAX_DAYS", 14),
		MaxFrames:              getEnvIntWithDefault("MAX_FRAMES", 4),
		StartingSlot:           getEnvIntWithDefault("SLOT_START", 12), // 6:00
		EndingSlot:             getEnvIntWithDefault("SLOT_END", 43),   // 21:45
		JwtSigningKey:          getEnvStringWithDefault("JWT_SIGNING_KEY", "test"),
		RegistrationCode:       getEnvStringWithDefault("REGISTRATION_CODE", "test"),
		Admins:                 admins,
		NotificationDiscord:    os.Getenv("NOTIFICATION_DISCORD"),
	}
}

func getEnvStringWithDefault(environmentVariable, defaultValue string) string {
	value := os.Getenv(environmentVariable)
	if value == "" {
		fmt.Println(fmt.Sprintf("[WARNING] Using default %s", environmentVariable))
		value = defaultValue
	}

	return value
}

func getEnvIntWithDefault(environmentVariable string, defaultValue int) int {
	envRaw := os.Getenv(environmentVariable)
	value := defaultValue
	if envRaw != "" {
		envInt, err := strconv.Atoi(envRaw)
		if err == nil {
			value = envInt
		}
	}

	if value == defaultValue {
		fmt.Println(fmt.Sprintf("[WARNING] Using default %s", environmentVariable))
	}

	return value
}
