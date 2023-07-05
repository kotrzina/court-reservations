package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

func (app *app) loginUser(c *gin.Context) {
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

	user, err := app.storage.GetUserByUsername(request.Username)
	if err != nil {
		c.JSON(createHttpError(400, "user does not exist"))
		return
	}

	if !isPasswordValid(request.Password, user.Hash) {
		c.JSON(createHttpError(http.StatusUnauthorized, "invalid password"))
		return
	}

	jwt, err := app.userService.GenerateJwt(user.Name, user.Username)
	if err != nil {
		c.JSON(createHttpError(http.StatusInternalServerError, "could not generate JWT token"))
		return
	}

	response := output{
		Name:     user.Name,
		Username: user.Username,
		IsAdmin:  app.userService.IsAdmin(user.Username),
		Jwt:      jwt,
	}

	c.JSON(http.StatusOK, response)
}

func (app *app) registerUser(c *gin.Context) {
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

	if request.Code != app.config.RegistrationCode {
		c.JSON(createHttpError(http.StatusBadRequest, "invalid registration code"))
		return
	}

	// check if user exists - error expected
	_, err = app.storage.GetUserByUsername(request.Username)
	if err == nil {
		c.JSON(createHttpError(http.StatusBadRequest, "user already exists"))
		return
	}

	if len(request.Name) < 5 || len(request.Username) < 2 || len(request.Password) < 5 || len(request.City) < 3 {
		c.JSON(createHttpError(http.StatusBadRequest, "invalid input"))
		return
	}

	err = app.storage.CreateUser(request.Username, request.Password, request.Name, request.City)
	if err != nil {
		c.JSON(createHttpError(http.StatusBadRequest, "could not create new user"))
		return
	}

	c.JSON(http.StatusOK, struct{}{})
}

func (app *app) getAllUsers(c *gin.Context) {
	type output struct {
		Username string `json:"username"`
		Name     string `json:"name"`
		City     string `json:"city"`
	}

	loggedUser, err := app.GetLoggedUser(c)
	if err != nil || !loggedUser.IsAdmin {
		c.JSON(createHttpError(http.StatusForbidden, "insufficient permissions"))
		return
	}

	users, err := app.storage.GetUsers()
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

func (app *app) deleteUser(c *gin.Context) {
	loggedUser, err := app.GetLoggedUser(c)
	if err != nil || !loggedUser.IsAdmin {
		c.JSON(createHttpError(http.StatusForbidden, "insufficient permissions"))
		return
	}

	username := c.Param("username")
	if username == "" {
		c.JSON(createHttpError(http.StatusNotFound, "invalid parameter username"))
		return
	}

	err = app.storage.DeleteUser(username)
	if err != nil {
		c.JSON(createHttpError(http.StatusInternalServerError, "could not delete user"))
		return
	}

	c.JSON(http.StatusOK, struct{}{})
}

func (app *app) generatePasswordChangeToken(c *gin.Context) {
	type output struct {
		Username string `json:"username"`
		Token    string `json:"token"`
	}

	loggedUser, err := app.GetLoggedUser(c)
	if err != nil || !loggedUser.IsAdmin {
		c.JSON(createHttpError(http.StatusForbidden, "insufficient permissions"))
		return
	}

	username := c.Param("username")
	if username == "" {
		c.JSON(createHttpError(http.StatusNotFound, "invalid parameter username"))
		return
	}

	token, err := app.userService.GeneratePasswordChangeToken(username)
	if err != nil {
		c.JSON(createHttpError(http.StatusInternalServerError, "could not generate password token"))
		return
	}

	c.JSON(http.StatusOK, output{
		Username: username,
		Token:    token,
	})
}

func (app *app) changePassword(c *gin.Context) {
	type input struct {
		Token    string `json:"token"`
		Password string `json:"password"`
	}

	var request input
	err := c.BindJSON(&request)
	if err != nil {
		c.JSON(createHttpError(http.StatusBadRequest, "could not decode input json"))
		return
	}

	if len(request.Password) < 5 {
		c.JSON(createHttpError(http.StatusBadRequest, "invalid password -> too short"))
		return
	}

	username, err := app.userService.VerifyPasswordChangeToken(request.Token)
	if err != nil {
		app.logger.WithField("token", request.Token).Error("invalid password change token")
		c.JSON(createHttpError(http.StatusBadRequest, "password change token is invalid"))
		return
	}

	err = app.storage.ChangePassword(username, request.Password)
	if err != nil {
		app.logger.WithError(err).Error("could not change user password")
		c.JSON(createHttpError(http.StatusInternalServerError, "could not change user password"))
		return
	}

	app.logger.WithField("username", username).Info("password changed")
	c.JSON(http.StatusOK, struct{}{})
}

func (app *app) alertNotification(c *gin.Context) {
	loggedUser, err := app.GetLoggedUser(c)
	if err != nil {
		c.JSON(createHttpError(http.StatusForbidden, "you have to be logged in to send alert"))
		return
	}

	type input struct {
		Title   string `json:"title"`
		Message string `json:"message"`
	}

	var request input
	err = c.BindJSON(&request)
	if err != nil {
		c.JSON(createHttpError(http.StatusBadRequest, "could not decode input json"))
		return
	}

	msg := fmt.Sprintf("User `%s` sent alert: %s", loggedUser.Username, request.Message)
	app.notificationService.SendAlert(request.Title, msg)
	c.JSON(http.StatusOK, struct{}{})
}
