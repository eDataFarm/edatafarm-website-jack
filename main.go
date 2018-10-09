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
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"
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
	Admin		bool		`db:"admin" form:"admin"`
}

// Job contains information about a single job
type Job struct {
	Id			int
	Title		string		`db:"title" form:"title" binding:"required"`
	ExpiresAt	string		`db:"expires_at" form:"expiresAt" binding:"required"`
	Description	string 		`db:"description" form:"description" binding:"required"`
	Applicants	int    		`db:"applicants" form:"applicants" binding:"required"`
}

// Create an empty list of jobs
var jobs []*Job

var jwtMiddleWare *jwtmiddleware.JWTMiddleware

const DBName = "edatafarm"

type DBType struct {
	DB *sql.DB
}

var (
	dbOnce sync.Once
	DBInstance *DBType
)

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

	// Initialize the DBInstance singleton
	initDB()

	// Initialize the jobs array
	jobs = getJobs()

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
		api.GET("/users/:email", UserHandler)
		api.GET("/users", UsersHandler)
		api.GET("/applicants/:jobID", UsersHandler)
		api.POST("/users", CreateUser)
		api.GET("/jobs", JobsHandler)
		api.POST("/jobs", CreateJob)
		api.POST("/jobs/apply/:jobID", ApplyJob)
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

// Initiaize the DBInstance singleton for server connections
func initDB() {
	dbOnce.Do(func () {
		dbinfo := fmt.Sprintf("dbname=%s sslmode=disable", DBName)
		db, err := sql.Open("postgres", dbinfo)

		if err != nil {
			log.Fatalln("Failed to open connection to db: ", err.Error())
		}

		DBInstance = &DBType{DB: db}
	})
}

// UsersHandler retrieves a list of available users
func UsersHandler(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	users := make([]*User, 0, 50)

	fmt.Println("Querying Users")
	queryUser := "SELECT id, name, email, age, gender, resume, education, about FROM userinfo"

	jobID := c.Param("jobID")

	if jobID != "" {
		queryUser += fmt.Sprintf(" where id in(SELECT user_id from user_job where job_id = %s);", jobID)
	}

	rows, err := DBInstance.DB.Query(queryUser)
	if err != nil {
		fmt.Println("Unable to query userinfo from db. Error message", err.Error())
		c.JSON(http.StatusServiceUnavailable, err.Error())
		return
	}

	for rows.Next() {
		user := new(User)
		var education string
		err = rows.Scan(&user.Id, &user.Name, &user.Email, &user.Age, &user.Gender, &user.Resume, &education, &user.About)
		if err != nil {
			fmt.Println("Unable to scan userinfo from db. Error message", err.Error())
			c.JSON(http.StatusServiceUnavailable, err.Error())
			return
		}

		user.Education = strings.Split(education, ",")
		users = append(users, user)
	}

	c.JSON(http.StatusOK, users)
}

// UserHandler retrieves a user
func UserHandler(c *gin.Context) {
	email := c.Param("email")
	user := new(User)

	if email == "null" {
		c.JSON(http.StatusOK, user)
		return
	}

	if m, err := regexp.MatchString(`^([\w\.\_]{2,10})@(\w{1,}).([a-z]{2,4})$`, email); !m {
		fmt.Println("Please provide a valid email address")
		c.JSON(http.StatusUnprocessableEntity, err.Error())
		return
	}

	c.Header("Content-Type", "application/json")

	fmt.Println("Querying User")
	var education string
	queryUser := fmt.Sprintf("SELECT id, name, email, age, gender, resume, education, about, admin FROM userinfo where email = '%s';", email)
	err := DBInstance.DB.QueryRow(queryUser).
		Scan(&user.Id, &user.Name, &user.Email, &user.Age, &user.Gender, &user.Resume, &education, &user.About, &user.Admin)
	if err != nil {
		fmt.Println("Unable to query userinfo from db. Error message", err.Error())
		c.JSON(http.StatusServiceUnavailable, err.Error())
		return
	}

	if user.Email == "" {
		// User email is invalid
		c.AbortWithStatus(http.StatusNotFound)
	}

	user.Education = strings.Split(education, ",")
	c.JSON(http.StatusOK, user)
}

// CreateUser creates a new user
func CreateUser(c *gin.Context) {
	user:= User{}
	c.Bind(&user)

	if user.Name != "" && user.Resume != "" {
		var lastInsertId int
		err := DBInstance.DB.QueryRow("INSERT INTO userinfo(name, age, gender, resume, education, about, email) VALUES($1,$2,$3,$4,$5,$6,$7) returning id;",
			user.Name, user.Age, user.Gender, user.Resume, strings.Join(user.Education, ","), user.About, user.Email).Scan(&lastInsertId)
		if err != nil {
			fmt.Println("Unable to insert userinfo into db. Error message", err.Error())
			c.JSON(http.StatusServiceUnavailable, err.Error())
			return
		}

		fmt.Println("last inserted id =", lastInsertId)
		// return a pointer to the new user
		c.JSON(http.StatusOK, &user)
	} else {
		c.JSON(http.StatusUnprocessableEntity, errors.New("unable to find appropriate user keys"))
	}
}

func getJobs() []*Job {
	jobs := make([]*Job, 0, 50)

	fmt.Println("Querying Jobs")
	queryJobs := fmt.Sprintf("SELECT id, title, description, applicants, expires_at FROM jobs where expires_at > '%s'",
		time.Now().Format("2006-01-02T15:04:05-0700"))
	rows, err := DBInstance.DB.Query(queryJobs)
	if err != nil {
		fmt.Println("Unable to query jobs from db. Error message", err.Error())
		log.Fatalf("could not get jobs: %+v", err)
	}

	for rows.Next() {
		job := new(Job)
		err = rows.Scan(&job.Id, &job.Title, &job.Description, &job.Applicants, &job.ExpiresAt)
		if err != nil {
			fmt.Println("Unable to scan job from db. Error message", err.Error())
			log.Fatalf("could not get job: %+v", err)
		}

		jobs = append(jobs, job)
	}

	return jobs
}

// JobsHandler retrieves a list of available jobs
func JobsHandler(c *gin.Context) {
	c.Header("Content-Type", "application/json")

	jobs = getJobs()

	c.JSON(http.StatusOK, jobs)
}

// CreateJob creates a new job
func CreateJob(c *gin.Context) {
	job:= Job{}
	c.Bind(&job)

	if job.Title != "" && job.Description != "" {
		weeksToAdd, err := strconv.Atoi(job.ExpiresAt)
		if err != nil {
			c.JSON(http.StatusUnprocessableEntity, errors.New("unable to convert expiresAt to int"))
			return
		}

		expiresAt := time.Now().AddDate(0, 0, 7 * weeksToAdd)

		var lastInsertId int
		err = DBInstance.DB.QueryRow("INSERT INTO jobs(title, description, expires_at) VALUES($1,$2,$3) returning id;",
			job.Title, job.Description, expiresAt.Format("2006-01-02T15:04:05-0700")).Scan(&lastInsertId)
		if err != nil {
			fmt.Println("Unable to insert job into db. Error message", err.Error())
			c.JSON(http.StatusServiceUnavailable, err.Error())
			return
		}

		fmt.Println("last inserted id =", lastInsertId)
		// return a pointer to the new job
		c.JSON(http.StatusOK, &job)
	} else {
		c.JSON(http.StatusUnprocessableEntity, errors.New("unable to find appropriate job keys"))
	}
}

func ApplyJob(c *gin.Context) {
	// Check job ID is valid
	if jobID, err := strconv.Atoi(c.Param("jobID")); err == nil {
		// find job and increment likes
		for i := 0; i < len(jobs); i++ {
			if jobs[i].Id == jobID {
				jobs[i].Applicants = jobs[i].Applicants + 1

				// Update join table with user
				email := c.Request.FormValue("email")
				var user_id sql.NullInt64
				queryUser := fmt.Sprintf("SELECT id FROM userinfo where email = '%s';", email)
				err := DBInstance.DB.QueryRow(queryUser).Scan(&user_id)
				if err != nil {
					fmt.Println("Unable to query userinfo from db. Error message", err.Error())
					c.JSON(http.StatusServiceUnavailable, err.Error())
					return
				}

				result := DBInstance.DB.QueryRow("INSERT INTO user_job(user_id, job_id) VALUES($1,$2);",
					user_id.Int64, jobID)
				if result == nil {
					fmt.Println("Unable to insert into user_job in db. Error message", err.Error())
					c.JSON(http.StatusServiceUnavailable, err.Error())
					return
				}

				break
			}
		}
		c.JSON(http.StatusOK, &jobs)
	} else {
		// the jobs ID is invalid
		c.AbortWithStatus(http.StatusNotFound)
	}
}