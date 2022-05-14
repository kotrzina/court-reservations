package main

import (
	"github.com/sirupsen/logrus"
	"os"
)

func main() {
	l := logrus.New()
	l.SetOutput(os.Stdout)

	c, err := LoadConfig()
	if err != nil {
		l.Fatal(err.Error())
	}

	s, err := NewStorage(c, l)
	if err != nil {
		l.Fatal(err.Error())
	}

	us := NewUserService(c.JwtSigningKey, c.Admins)

	ns := NewNotificationService(c, l)

	server := NewServer(s, c, us, ns, l)
	server.StartServer()
}
