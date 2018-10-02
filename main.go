package main

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/auth0/go-jwt-middleware"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"log"
	"net/http"
	"os"
	"strings"
)

type Response struct {
	Message string `json:"message"`
}

type Jwks struct {
	Keys []JSONWebKeys `json:"keys"`
}

type JSONWebKeys struct {
	Kty string   `json:"kty"`
	Kid string   `json:"kid"`
	Use string   `json:"use"`
	N   string   `json:"n"`
	E   string   `json:"e"`
	X5c []string `json:"x5c"`
}

// User contains information about a single User
type User struct {
	Id			int
	Name 		string 		`db:"name" form:"name" binding:"required"`
	Email 		string 		`db:"email" form:"email" binding:"required"`
	Age  		int 		`db:"age" form:"age" binding:"required"`
	Gender 		string 		`db:"gender" form:"gender" binding:"required"`
	Resume 		string 		`db:"resume" form:"resume" binding:"required"`
	Education 	[]string	`db:"education" form:"education[]"`
	About 		string 		`db:"about" form:"about" binding:"required"`
}

var jwtMiddleWare *jwtmiddleware.JWTMiddleware

const DBName = "edatafarm"

var db *sql.DB

func main() {
	jwtMiddleware := jwtmiddleware.New(jwtmiddleware.Options{
		ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {
			aud := os.Getenv("AUTH0_API_AUDIENCE")
			checkAudience := token.Claims.(jwt.MapClaims).VerifyAudience(aud, false)
			if !checkAudience {
				return token, errors.New("invalid audience")
			}
			// verify iss claim
			iss := os.Getenv("AUTH0_DOMAIN")
			checkIss := token.Claims.(jwt.MapClaims).VerifyIssuer(iss, false)
			if !checkIss {
				return token, errors.New("invalid issuer")
			}

			cert, err := getPemCert(token)
			if err != nil {
				log.Fatalf("could not get cert: %+v", err)
			}

			result, _ := jwt.ParseRSAPublicKeyFromPEM([]byte(cert))
			return result, nil
		},
		SigningMethod: jwt.SigningMethodRS256,
	})

	jwtMiddleWare = jwtMiddleware

	// Set the router as the default one shipped with Gin
	router := gin.Default()

	// Serve frontend static files
	router.Use(static.Serve("/", static.LocalFile("./views", true)))

	// Setup route group for the API
	api := router.Group("/api")
	{
		api.GET("/", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "pong",
			})
		})
		api.GET("/users", authMiddleware(), UserHandler)
		api.POST("/users", authMiddleware(), CreateUser)
	}

	// Start and run the server
	router.Run(":3000")
}

func getPemCert(token *jwt.Token) (string, error) {
	cert := ""
	resp, err := http.Get(os.Getenv("AUTH0_DOMAIN") + ".well-known/jwks.json")
	if err != nil {
		return cert, err
	}
	defer resp.Body.Close()

	var jwks = Jwks{}
	err = json.NewDecoder(resp.Body).Decode(&jwks)

	if err != nil {
		return cert, err
	}

	x5c := jwks.Keys[0].X5c
	for k, v := range x5c {
		if token.Header["kid"] == jwks.Keys[k].Kid {
			cert = "-----BEGIN CERTIFICATE-----\n" + v + "\n-----END CERTIFICATE-----"
		}
	}

	if cert == "" {
		return cert, errors.New("unable to find appropriate key")
	}

	return cert, nil
}

// authMiddleware intercepts the requests, and check for a valid jwt token
func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get the client secret key
		err := jwtMiddleWare.CheckJWT(c.Writer, c.Request)
		if err != nil {
			// Token not found
			fmt.Println(err)
			c.Abort()
			c.Writer.WriteHeader(http.StatusUnauthorized)
			c.Writer.Write([]byte("Unauthorized"))
			return
		}
	}
}

// UserHandler retrieves a list of available users
func UserHandler(c *gin.Context) {
  c.Header("Content-Type", "application/json")
  users := make([]string, 0, 50)
  c.JSON(http.StatusOK, users)
}

// CreateUser creates a new user
func CreateUser(c *gin.Context) {
	user:= User{}
	c.Bind(&user)

	if user.Name != "" && user.Resume != "" {
		dbinfo := fmt.Sprintf("dbname=%s sslmode=disable", DBName)
		db, err := sql.Open("postgres", dbinfo)
		if err != nil {
			log.Fatalln("Failed to open connection to db: ", err.Error())
		}
		defer db.Close()

		var lastInsertId int
		err = db.QueryRow("INSERT INTO userinfo(name, age, gender, resume, education, about, email) VALUES($1,$2,$3,$4,$5,$6,$7) returning id;",
			user.Name, user.Age, user.Gender, user.Resume, strings.Join(user.Education, ","), user.About, user.Email).Scan(&lastInsertId)
		if err != nil {
			fmt.Println("Unable to insert userinfo into db. Error message", err.Error())
			c.JSON(http.StatusServiceUnavailable, err.Error())
			return
		}

		fmt.Println("last inserted id =", lastInsertId)
		// return a pointer to the updated users list
		c.JSON(http.StatusOK, &user)
	} else {
		c.JSON(http.StatusUnprocessableEntity, errors.New("unable to find appropriate user keys"))
	}
}

