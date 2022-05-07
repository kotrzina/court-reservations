package main

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestSuccessLogin(t *testing.T) {
	svc := NewUserService("test_token")

	name := "test_name"
	username := "test_username"

	token, _ := svc.GenerateJwt(name, username)
	user, _ := svc.VerifyJwt(token)

	assert.Equal(t, name, user.Name)
	assert.Equal(t, username, user.Username)
}

func TestInvalidToken(t *testing.T) {
	svc := NewUserService("test_token")

	name := "test_name"
	username := "test_username"

	token, _ := svc.GenerateJwt(name, username)
	token = fmt.Sprintf("%s%s", token, "thisisinvalidtoken")
	_, err := svc.VerifyJwt(token)

	assert.Error(t, err)
}
