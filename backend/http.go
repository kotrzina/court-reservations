package main

import (
	"context"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"
)

type Server struct {
	storage     *Storage
	config      *Config
	userService *UserService
	port        int
}

func NewServer(s *Storage, c *Config, us *UserService, port int) *Server {
	return &Server{
		storage:     s,
		config:      c,
		userService: us,
		port:        port,
	}
}

func (srv *Server) StartServer() {
	apiSrv := &http.Server{
		Handler: srv.createRouter(),
		Addr:    fmt.Sprintf(":%d", srv.port),
	}

	go func() {
		if err := apiSrv.ListenAndServe(); err != nil && errors.Is(err, http.ErrServerClosed) {
			log.Printf("listen: %s\n", err)
		}
	}()

	quit := make(chan os.Signal)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	if err := apiSrv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("Server exiting")
}

func (srv *Server) createRouter() *gin.Engine {
	router := gin.New()
	router.Use(gin.Recovery())
	router.Use(gin.Logger())
	router.Use(CORSMiddleware())

	public := router.Group("/api/public")
	{
		public.GET("/v1/time-table", srv.createTimeTableEndpoint(false))
		public.POST("/v1/user/register", srv.registerUser)
		public.POST("/v1/user/login", srv.loginUser)
	}

	private := router.Group("/api/private")
	private.Use(srv.AuthMiddleware())
	{
		private.GET("/v1/time-table", srv.createTimeTableEndpoint(true))
		private.GET("/v1/available/:date/:firstSlot", srv.getAvailable)
		private.POST("/v1/reservation", srv.postReservation)
	}

	router.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "Hello world! (https://github.com/kotrzina/court-reservations)")
	})

	router.GET("/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "pong")
	})

	return router
}

func (srv *Server) AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		_, err := srv.GetLoggedUser(c)
		if err != nil {
			c.AbortWithStatusJSON(createHttpError(http.StatusUnauthorized, "invalid JWT token"))
		}
		c.Next()
	}
}

func (srv *Server) GetLoggedUser(c *gin.Context) (*LoggedUser, error) {
	reqToken := c.GetHeader("Authorization")
	splitToken := strings.Split(reqToken, "Bearer ")
	if len(splitToken) != 2 {
		return nil, fmt.Errorf("could not read bearer token")
	}
	token := splitToken[1]
	user, err := srv.userService.VerifyJwt(token)
	if err != nil {
		return nil, fmt.Errorf("invalid jwt token")
	}

	return user, nil
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
