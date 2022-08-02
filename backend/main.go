package main

import (
	"github.com/sirupsen/logrus"
	"os"
)

func main() {
	config := loadConfig()
	logs := logrus.New()
	logs.SetOutput(os.Stdout)
	storage, err := newStorage(config, logs)
	if err != nil {
		logs.Fatal(err.Error())
	}
	userService := NewUserService(config.JwtSigningKey, config.Admins)
	ns := NewNotificationService(config, logs)

	server := NewApp(storage, config, userService, ns, logs)
	server.StartServer()
}
