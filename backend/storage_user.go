package main

import (
	"context"
	"golang.org/x/crypto/bcrypt"
)

const colUser = "createUser"

type Role int64

const (
	RoleRegular = 0
	RoleAdmin   = 1
)

type User struct {
	Username string
	Hash     string // password hash
	Name     string // real name
	Role     int64
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
		Role:     data["role"].(int64),
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
		"role":     RoleRegular,
	}

	ctx := context.Background()
	_, err = s.client.Collection(colUser).Doc(username).Set(ctx, u)

	return err
}

func (s *Storage) ChangeUserRole(username string, role int64) error {
	ctx := context.Background()
	doc, err := s.client.Collection(colUser).Doc(username).Get(ctx)
	if err != nil {
		return err
	}

	data := doc.Data()
	u := map[string]interface{}{
		"username": data["username"].(string),
		"hash":     data["hash"].(string),
		"name":     data["name"].(string),
		"role":     role,
	}

	_, err = s.client.Collection(colUser).Doc(username).Set(ctx, u)

	return err
}

func PasswordValid(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}
