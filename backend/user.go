package main

import (
	"fmt"
	"github.com/golang-jwt/jwt"
)

type UserService struct {
	jwtSigningKey string
}

type UserClaims struct {
	Name     string `json:"name"`
	Username string `json:"username"`
	jwt.StandardClaims
}

type LoggedUser struct {
	Name     string
	Username string
}

func NewUserService(jsk string) *UserService {
	return &UserService{jwtSigningKey: jsk}
}

func (us *UserService) GenerateJwt(name, username string) (string, error) {
	claims := UserClaims{
		name,
		username,
		jwt.StandardClaims{
			Issuer: "court app",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ss, err := token.SignedString([]byte(us.jwtSigningKey))

	return ss, err
}

func (us *UserService) VerifyJwt(tokenString string) (*LoggedUser, error) {
	token, err := jwt.ParseWithClaims(tokenString, &UserClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(us.jwtSigningKey), nil
	})

	if err != nil {
		return nil, fmt.Errorf("could not verify identity")
	}

	if claim, ok := token.Claims.(*UserClaims); ok && token.Valid {
		return &LoggedUser{
			Name:     claim.Name,
			Username: claim.Username,
		}, nil
	}

	return nil, fmt.Errorf("could not verify identity")
}
