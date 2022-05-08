package main

import (
	"context"
	"golang.org/x/crypto/bcrypt"
)

const colUser = "createUser"

type User struct {
	Username string
	Hash     string // password hash
	Name     string // real name
}

func (s *Storage) GetUserByUsername(username string) (*User, error) {
	ctx := context.Background()
	doc, err := s.client.Collection(colUser).Doc(username).Get(ctx)
	if err != nil {
		return nil, err
	}

	data := doc.Data()
	return &User{
		Username: data["username"].(string),
		Hash:     data["hash"].(string),
		Name:     data["name"].(string),
	}, nil
}

func (s *Storage) CreateUser(username, password, name string) error {
	hash, err := hashPassword(password)
	if err != nil {
		return err
	}

	u := map[string]interface{}{
		"username": username,
		"hash":     hash,
		"name":     name,
	}

	ctx := context.Background()
	_, err = s.client.Collection(colUser).Doc(username).Set(ctx, u)
	if err != nil {
		s.logger.Error(err)
	}

	return err
}

func (s *Storage) GetUsers() ([]User, error) {
	ctx := context.Background()
	docs, err := s.client.Collection(colUser).Documents(ctx).GetAll()
	if err != nil {
		s.logger.Error(err)
		return nil, err
	}

	users := []User{}
	for _, doc := range docs {
		data := doc.Data()
		users = append(users, User{
			Username: data["username"].(string),
			Hash:     data["hash"].(string),
			Name:     data["name"].(string),
		})
	}

	return users, nil
}

func (s *Storage) DeleteUser(username string) error {
	ctx := context.Background()
	_, err := s.client.Collection(colUser).Doc(username).Delete(ctx)
	if err != nil {
		s.logger.Error(err)
	}
	return err
}

func isPasswordValid(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}
