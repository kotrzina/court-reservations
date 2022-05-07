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
	api := router.Group("/api")
	{
		api.GET("/time-table", srv.getTimeTable)
		api.GET("/available/:date/:firstSlot", srv.getAvailable)
		api.POST("/reservation", srv.postReservation)

		api.POST("/user/register", srv.registerUser)
		api.POST("/user/login", srv.loginUser)

	}

	router.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "Welcome Gin Server")
	})

	router.GET("/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "pong")
	})

	return router
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
