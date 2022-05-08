package main

import (
	"github.com/sirupsen/logrus"
	"os"
)

func main() {
	l := logrus.New()
	l.SetOutput(os.Stdout)

	project := os.Getenv("PROJECT")

	s, err := NewStorage(project, l)
	if err != nil {
		l.Fatal(err.Error())
	}

	c, err := LoadConfig()
	if err != nil {
		l.Fatal(err.Error())
	}

	us := NewUserService(c.JwtSigningKey, c.Admins)

	server := NewServer(s, c, us, l, 8081)
	server.StartServer()
}
