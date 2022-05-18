package main

import (
	"github.com/sirupsen/logrus"
	"os"
)

func main() {
	config := LoadConfig()
	logs := logrus.New()
	logs.SetOutput(os.Stdout)
	storage, err := NewStorage(config, logs)
	if err != nil {
		logs.Fatal(err.Error())
	}
	userService := NewUserService(config.JwtSigningKey, config.Admins)
	ns := NewNotificationService(config, logs)

	server := NewServer(storage, config, userService, ns, logs)
	server.StartServer()
}
