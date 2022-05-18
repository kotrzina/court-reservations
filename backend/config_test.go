package main

import (
	"github.com/stretchr/testify/assert"
	"os"
	"testing"
)

func TestLoadConfig(t *testing.T) {
	_ = os.Setenv("REGISTRATION_CODE", "my_registration_code")
	c := LoadConfig()

	assert.Equal(t, 8081, c.Port)
	assert.Equal(t, "test", c.JwtSigningKey)
	assert.Equal(t, "my_registration_code", c.RegistrationCode)
}

func TestGetEnvStringWithDefault(t *testing.T) {
	name := "TESTING_ENV"
	v := getEnvStringWithDefault(name, "abc")
	assert.Equal(t, "abc", v)

	_ = os.Setenv(name, "xyz")
	v = getEnvStringWithDefault(name, "abc")
	assert.Equal(t, "xyz", v)
}

func TestGetEnvIntWithDefault(t *testing.T) {
	name := "TESTING_ENV"
	v := getEnvIntWithDefault(name, 123)
	assert.Equal(t, 123, v)

	_ = os.Setenv(name, "987")
	v = getEnvIntWithDefault(name, 123)
	assert.Equal(t, 987, v)

	_ = os.Setenv(name, "not int in variable")
	v = getEnvIntWithDefault(name, 123)
	assert.Equal(t, 123, v)
}
