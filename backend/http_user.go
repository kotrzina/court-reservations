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
		IsAdmin  bool   `json:"isAdmin"`
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

	if !isPasswordValid(request.Password, user.Hash) {
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
		IsAdmin:  srv.userService.IsAdmin(user.Username),
		Jwt:      jwt,
	}

	c.JSON(http.StatusOK, response)
}

func (srv *Server) registerUser(c *gin.Context) {
	type input struct {
		Name     string `json:"name"`
		Username string `json:"username"`
		Password string `json:"password"`
		City     string `json:"city"`
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

	if len(request.Name) < 5 || len(request.Username) < 2 || len(request.Password) < 5 || len(request.City) < 3 {
		c.JSON(createHttpError(http.StatusBadRequest, "invalid input"))
		return
	}

	err = srv.storage.CreateUser(request.Username, request.Password, request.Name, request.City)
	if err != nil {
		c.JSON(createHttpError(http.StatusBadRequest, "could not create new user"))
		return
	}

	c.JSON(http.StatusOK, struct{}{})
}

func (srv *Server) getAllUsers(c *gin.Context) {
	type output struct {
		Username string `json:"username"`
		Name     string `json:"name"`
		City     string `json:"city"`
	}

	loggedUser, err := srv.GetLoggedUser(c)
	if err != nil || !loggedUser.IsAdmin {
		c.JSON(createHttpError(http.StatusForbidden, "insufficient permissions"))
		return
	}

	users, err := srv.storage.GetUsers()
	if err != nil {
		c.JSON(createHttpError(http.StatusInternalServerError, "could not load list of users"))
		return
	}

	response := []output{}
	for _, u := range users {
		response = append(response, output{
			Username: u.Username,
			Name:     u.Name,
			City:     u.City,
		})
	}

	c.JSON(http.StatusOK, response)
}

func (srv *Server) deleteUser(c *gin.Context) {
	loggedUser, err := srv.GetLoggedUser(c)
	if err != nil || !loggedUser.IsAdmin {
		c.JSON(createHttpError(http.StatusForbidden, "insufficient permissions"))
		return
	}

	username := c.Param("username")
	if username == "" {
		c.JSON(createHttpError(http.StatusNotFound, "invalid parameter username"))
		return
	}

	err = srv.storage.DeleteUser(username)
	if err != nil {
		c.JSON(createHttpError(http.StatusInternalServerError, "could not delete user"))
		return
	}

	c.JSON(http.StatusOK, struct{}{})
}
