package main

import (
	"context"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"github.com/toorop/gin-logrus"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"
)

type app struct {
	storage             *storage
	config              *config
	userService         *UserService
	notificationService *NotificationService
	logger              *logrus.Logger
	port                int
}

func NewApp(s *storage, c *config, us *UserService, ns *NotificationService, l *logrus.Logger) *app {
	return &app{
		storage:             s,
		config:              c,
		userService:         us,
		port:                c.Port,
		logger:              l,
		notificationService: ns,
	}
}

func (app *app) StartServer() {
	apiSrv := &http.Server{
		Handler: app.newRouter(),
		Addr:    fmt.Sprintf(":%d", app.port),
	}

	go func() {
		if err := apiSrv.ListenAndServe(); err != nil && errors.Is(err, http.ErrServerClosed) {
			app.logger.Printf("listen: %s\n", err)
		}
	}()

	quit := make(chan os.Signal)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	app.logger.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	if err := apiSrv.Shutdown(ctx); err != nil {
		app.logger.Fatal("app forced to shutdown:", err)
	}

	app.logger.Println("app exiting")
}

func (app *app) newRouter() *gin.Engine {
	router := gin.New()
	router.Use(gin.Recovery())
	router.Use(ginlogrus.Logger(app.logger))
	router.Use(CORSMiddleware())

	public := router.Group("/api/public")
	{
		public.GET("/v1/time-table", app.createTimeTableEndpoint(false))
		public.POST("/v1/user/register", app.registerUser)
		public.POST("/v1/user/login", app.loginUser)
		public.POST("/v1/change-password", app.changePassword)
	}

	private := router.Group("/api/private")
	private.Use(app.AuthMiddleware())
	{
		private.GET("/v1/time-table", app.createTimeTableEndpoint(true))
		private.GET("/v1/available/:date/:firstSlot", app.getAvailable)
		private.DELETE("/v1/reservation/:date/:slotFrom", app.deleteReservation)
		private.POST("/v1/reservation", app.postReservation)
		private.POST("/v1/alert-notification", app.alertNotification)

		private.GET("/v1/admin/reservation", app.getAllReservations)
		private.POST("/v1/admin/reservation", app.postReservationMaintenance)
		private.GET("/v1/admin/user", app.getAllUsers)
		private.DELETE("/v1/admin/user/:username", app.deleteUser)
		private.GET("/v1/admin/user/:username/generate-password-token", app.generatePasswordChangeToken)
	}

	router.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "Hello world! (https://github.com/kotrzina/court-reservations)")
	})

	router.GET("/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "pong")
	})

	return router
}

func (app *app) AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		_, err := app.GetLoggedUser(c)
		if err != nil {
			c.AbortWithStatusJSON(createHttpError(http.StatusUnauthorized, "invalid JWT token"))
		}
		c.Next()
	}
}

func (app *app) GetLoggedUser(c *gin.Context) (*LoggedUser, error) {
	reqToken := c.GetHeader("Authorization")
	splitToken := strings.Split(reqToken, "Bearer ")
	if len(splitToken) != 2 {
		return nil, fmt.Errorf("could not read bearer token")
	}
	token := splitToken[1]
	user, err := app.userService.VerifyJwt(token)
	if err != nil {
		return nil, fmt.Errorf("invalid jwt token")
	}

	return user, nil
}

func (app *app) checkMaxDays(now, reservation time.Time) error {
	if RoundDay(now).Add((time.Duration(app.config.MaxDays) - 1) * 24 * time.Hour).Before(RoundDay(reservation)) {
		return fmt.Errorf("max days check failed")
	}
	return nil
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func createHttpError(code int, msg string) (int, map[string]string) {
	return code, map[string]string{
		"code":    fmt.Sprintf("%d", code),
		"message": msg,
	}
}
