package main

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestSuccessLogin(t *testing.T) {
	svc := NewUserService("test_token", []string{})

	name := "test_name"
	username := "test_username"

	token, _ := svc.GenerateJwt(name, username)
	user, _ := svc.VerifyJwt(token)

	assert.Equal(t, name, user.Name)
	assert.Equal(t, username, user.Username)
}

func TestInvalidToken(t *testing.T) {
	svc := NewUserService("test_token", []string{})

	name := "test_name"
	username := "test_username"

	token, _ := svc.GenerateJwt(name, username)
	token = fmt.Sprintf("%s%s", token, "thisisinvalidtoken")
	_, err := svc.VerifyJwt(token)

	assert.Error(t, err)
}

func TestIsAdmin(t *testing.T) {
	svc := NewUserService("test_token", []string{"u1", "u4"})

	assert.True(t, svc.IsAdmin("u1"))
	assert.True(t, svc.IsAdmin("u4"))

	assert.False(t, svc.IsAdmin("u1u"))
	assert.False(t, svc.IsAdmin("uu1"))
	assert.False(t, svc.IsAdmin("u3"))
	assert.False(t, svc.IsAdmin(""))
	assert.False(t, svc.IsAdmin(":)"))
}
