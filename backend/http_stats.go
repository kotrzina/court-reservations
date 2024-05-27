package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"os"
)

// getConfig returns list of environment variables
// only available for admin users
func (app *app) getConfig(c *gin.Context) {
	loggedUser, err := app.GetLoggedUser(c)
	if err != nil || !loggedUser.IsAdmin {
		c.JSON(createHttpError(http.StatusForbidden, "insufficient permissions"))
		return
	}

	envs := os.Environ()
	c.JSON(http.StatusOK, envs)
}
