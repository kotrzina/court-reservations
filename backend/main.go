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

	server := NewServer(s, c, 8081)
	server.StartServer()
}
