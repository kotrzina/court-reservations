package main

import (
	"cloud.google.com/go/firestore"
	"context"
	"fmt"
	"github.com/sirupsen/logrus"
	"log"
	"os"
)

type Storage struct {
	client *firestore.Client
	config *Config
	logger *logrus.Logger
}

func NewStorage(c *Config, logger *logrus.Logger) (*Storage, error) {
	ctx := context.Background()
	client, err := firestore.NewClient(ctx, c.GoogleProjectId)

	if value := os.Getenv("FIRESTORE_EMULATOR_HOST"); value != "" {
		log.Printf("Using Firestore Emulator: %s", value)
	}

	if err != nil {
		logger.Error(err)
		return nil, fmt.Errorf("could not connect to firestore: %w", err)
	}

	return &Storage{client: client, config: c, logger: logger}, nil
}
