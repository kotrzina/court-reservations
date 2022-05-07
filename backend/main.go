package main

import (
	"os"
)

func main() {
	project := os.Getenv("PROJECT")
	project = "asd"

	s, err := NewStorage(project)
	if err != nil {
		panic(err)
	}

	c, err := LoadConfig()
	if err != nil {
		panic(err)
	}

	us := NewUserService(c.JwtSigningKey)

	server := NewServer(s, c, us, 8081)
	server.StartServer()
}
