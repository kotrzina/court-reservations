package main

import (
	"cloud.google.com/go/firestore"
	"context"
	"fmt"
	"log"
	"os"
)

type Storage struct {
	client *firestore.Client
}

func NewStorage(project string) (*Storage, error) {
	ctx := context.Background()
	client, err := firestore.NewClient(ctx, project)

	if value := os.Getenv("FIRESTORE_EMULATOR_HOST"); value != "" {
		log.Printf("Using Firestore Emulator: %s", value)
	}

	if err != nil {
		return nil, fmt.Errorf("could not connect to firestore: %w", err)
	}

	return &Storage{client: client}, nil
}
