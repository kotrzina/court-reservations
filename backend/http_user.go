package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func (srv *Server) loginUser(c *gin.Context) {
	type input struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	type output struct {
		Username string `json:"username"`
		Name     string `json:"name"`
		Jwt      string `json:"jwt"`
	}

	var request input
	err := c.BindJSON(&request)
	if err != nil {
		c.JSON(createHttpError(400, "could not decode input json"))
		return

	}

	_, err = srv.storage.GetUserByUsername(request.Username)
	if err == nil {
		c.JSON(createHttpError(400, "user already exists"))
		return
	}

	response := output{
		Name:     "todo",
		Username: request.Username,
		Jwt:      "todo",
	}

	c.JSON(http.StatusOK, response)
}

func (srv *Server) registerUser(c *gin.Context) {
	type input struct {
		Name     string `json:"name"`
		Username string `json:"username"`
		Password string `json:"password"`
	}

	var request input
	err := c.BindJSON(&request)
	if err != nil {
		c.JSON(createHttpError(400, "could not decode input json"))
		return

	}

	_, err = srv.storage.GetUserByUsername(request.Username)
	if err == nil {
		c.JSON(createHttpError(400, "user already exists"))
		return
	}

	err = srv.storage.CreateUser(request.Username, request.Password, request.Name)
	if err != nil {
		c.JSON(createHttpError(400, "could not create new user"))
		return
	}

	c.JSON(http.StatusOK, struct{}{})
}
