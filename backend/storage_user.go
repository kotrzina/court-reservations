package main

import (
	"context"
	"golang.org/x/crypto/bcrypt"
	"strings"
	"time"
)

type User struct {
	Username string
	Hash     string // password hash
	Name     string // real name
	City     string
}

func (s *Storage) GetUserByUsername(username string) (*User, error) {
	ctx := context.Background()
	doc, err := s.client.Collection(s.config.CollectionUsers).Doc(strings.ToLower(username)).Get(ctx)
	if err != nil {
		return nil, err
	}

	data := doc.Data()
	user := mapUser(data)
	return &user, nil
}

func (s *Storage) CreateUser(username, password, name, city string) error {
	hash, err := hashPassword(password)
	if err != nil {
		return err
	}

	u := map[string]interface{}{
		"username": strings.ToLower(username),
		"hash":     hash,
		"name":     name,
		"city":     city,
		"created":  time.Now().In(getLocation()),
	}

	ctx := context.Background()
	_, err = s.client.Collection(s.config.CollectionUsers).Doc(strings.ToLower(username)).Set(ctx, u)
	if err != nil {
		s.logger.Error(err)
	}

	return err
}

func (s *Storage) GetUsers() ([]User, error) {
	ctx := context.Background()
	docs, err := s.client.Collection(s.config.CollectionUsers).Documents(ctx).GetAll()
	if err != nil {
		s.logger.Error(err)
		return nil, err
	}

	users := []User{}
	for _, doc := range docs {
		data := doc.Data()
		users = append(users, mapUser(data))
	}

	return users, nil
}

func (s *Storage) DeleteUser(username string) error {
	ctx := context.Background()
	_, err := s.client.Collection(s.config.CollectionUsers).Doc(strings.ToLower(username)).Delete(ctx)
	if err != nil {
		s.logger.Error(err)
	}
	return err
}

func mapUser(data map[string]interface{}) User {
	return User{
		Username: strings.ToLower(data["username"].(string)),
		Hash:     data["hash"].(string),
		Name:     data["name"].(string),
		City:     data["city"].(string),
	}
}

func isPasswordValid(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}
