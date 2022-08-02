package main

import (
	"cloud.google.com/go/firestore"
	"context"
	"fmt"
	"github.com/sirupsen/logrus"
	"log"
	"os"
)

type storage struct {
	client *firestore.Client
	config *config
	logger *logrus.Logger
}

func newStorage(c *config, logger *logrus.Logger) (*storage, error) {
	ctx := context.Background()
	client, err := firestore.NewClient(ctx, c.GoogleProjectId)

	if value := os.Getenv("FIRESTORE_EMULATOR_HOST"); value != "" {
		log.Printf("Using Firestore Emulator: %s", value)
	}

	if err != nil {
		logger.Error(err)
		return nil, fmt.Errorf("could not connect to firestore: %w", err)
	}

	return &storage{client: client, config: c, logger: logger}, nil
}
