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

	user, err := srv.storage.GetUserByUsername(request.Username)
	if err != nil {
		c.JSON(createHttpError(400, "user does not exist"))
		return
	}

	if !PasswordValid(request.Password, user.Hash) {
		c.JSON(createHttpError(http.StatusUnauthorized, "invalid password"))
		return
	}

	jwt, err := srv.userService.GenerateJwt(user.Name, user.Username)
	if err != nil {
		c.JSON(createHttpError(http.StatusInternalServerError, "could not generate JWT token"))
		return
	}

	response := output{
		Name:     user.Name,
		Username: user.Username,
		Jwt:      jwt,
	}

	c.JSON(http.StatusOK, response)
}

func (srv *Server) registerUser(c *gin.Context) {
	type input struct {
		Name     string `json:"name"`
		Username string `json:"username"`
		Password string `json:"password"`
		Code     string `json:"code"`
	}

	var request input
	err := c.BindJSON(&request)
	if err != nil {
		c.JSON(createHttpError(http.StatusBadRequest, "could not decode input json"))
		return
	}

	if request.Code != srv.config.RegistrationCode {
		c.JSON(createHttpError(http.StatusBadRequest, "invalid registration code"))
		return
	}

	// check if user exists - error expected
	_, err = srv.storage.GetUserByUsername(request.Username)
	if err == nil {
		c.JSON(createHttpError(http.StatusBadRequest, "user already exists"))
		return
	}

	err = srv.storage.CreateUser(request.Username, request.Password, request.Name)
	if err != nil {
		c.JSON(createHttpError(http.StatusBadRequest, "could not create new user"))
		return
	}

	c.JSON(http.StatusOK, struct{}{})
}
