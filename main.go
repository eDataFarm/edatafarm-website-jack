package main

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/auth0/go-jwt-middleware"
	"github.com/dgrijalva/jwt-go"
	"github.com/fatih/structs"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"io/ioutil"
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
	Phone  		string 		`db:"phone" form:"phone" binding:"required"`
	Position 	[]string 	`db:"position" form:"position[]" binding:"required"`
	Languages 	[]string 		`db:"languages" form:"languages"`
	Referrer  	string 		`db:"referrer" form:"referrer"`
	Resume 		string 		`db:"resume" form:"resume" binding:"required"`
	Education 	[]string	`db:"education" form:"education[]"`
	Major  		string 		`db:"major" form:"major"`
	About 		string 		`db:"about" form:"about" binding:"required"`
	Skills  	string 		`db:"skills" form:"skills" binding:"required"`
	Ref1  		string 		`db:"ref1" form:"ref1" binding:"required"`
	Ref2  		string 		`db:"ref2" form:"ref2" binding:"required"`
	Ref3  		string 		`db:"ref3" form:"ref3" binding:"required"`
	Admin		bool		`db:"admin" form:"admin"`
}

// Job contains information about a single job
type Job struct {
	Id			int
	Title		string		`db:"title" form:"title" binding:"required"`
	Expiration	string		`db:"expiration" form:"expiration" binding:"required"`
	Description	string 		`db:"description" form:"description" binding:"required"`
	Applicants	int64    	`db:"applicants" form:"applicants"`
	Country		string		`db:"country" form:"country" binding:"required"`
	Languages	[]string	`db:"languages" form:"languages"`
}

type NewJob struct {
	*Job
	Countries []string
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
	jobs = getJobs("")

	// Set the router as the default one shipped with Gin
	router := gin.Default()

	// Serve frontend static files
	router.Use(static.Serve("/", static.LocalFile("./views", true)))

	// Setup route group for the API
	api := router.Group("/api/v1")
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
		api.GET("/jobs/:jobID", JobHandler)
		api.GET("/jobs", JobsHandler)
		api.GET("/filteredJobs/:country", FilteredJobsHandler)
		api.POST("/jobs", CreateJob)
		api.POST("/jobs/apply/:jobID", ApplyJob)
		api.GET("/countries", CountriesHandler)
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

		// TODO: Migrate the schema
	})
}

// UsersHandler retrieves a list of available users
func UsersHandler(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	users := make([]*User, 0, 50)

	fmt.Println("Querying Users")
	targetColumnNames := structs.Names(&User{})
	whereClause := "email != ''"
	jobID := c.Param("jobID")

	if jobID != "" {
		whereClause = fmt.Sprintf("id in(SELECT user_id from user_job where job_id = %s);", jobID)
	}

	queryUser := buildSelectStatement("userinfo", targetColumnNames, whereClause)
	rows, err := DBInstance.DB.Query(queryUser)
	if err != nil {
		fmt.Printf("Unable to run '%s' against table userinfo in db. Error message: %s\n", queryUser, err.Error())
		c.JSON(http.StatusServiceUnavailable, err.Error())
		return
	}

	for rows.Next() {
		user := new(User)
		var education, position, languages string
		err = rows.Scan(&user.Id, &user.Name, &user.Email, &user.Phone, &position, &languages, &user.Referrer,
			&user.Resume, &education, &user.Major, &user.About, &user.Skills, &user.Ref1, &user.Ref2, &user.Ref3, &user.Admin)
		if err != nil {
			fmt.Println("Unable to scan userinfo from db. Error message", err.Error())
			c.JSON(http.StatusServiceUnavailable, err.Error())
			return
		}

		user.Position = strings.Split(position, ",")
		user.Languages = strings.Split(languages, ",")
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
	var education, position, languages string
	targetColumnNames := structs.Names(&User{})
	whereClause := fmt.Sprintf("email = '%s';", email)
	queryUser := buildSelectStatement("userinfo", targetColumnNames, whereClause)
	err := DBInstance.DB.QueryRow(queryUser).
		Scan(&user.Id, &user.Name, &user.Email, &user.Phone, &position, &languages, &user.Referrer,
			&user.Resume, &education, &user.Major, &user.About, &user.Skills, &user.Ref1, &user.Ref2, &user.Ref3, &user.Admin)

	if user.Email == "" {
		// User email is invalid
		c.AbortWithStatus(http.StatusNotFound)
	}

	if err != nil {
		fmt.Printf("Unable to run '%s' against table userinfo in db. Error message: %s\n", queryUser, err.Error())
		c.JSON(http.StatusServiceUnavailable, err.Error())
		return
	}

	user.Position = strings.Split(position, ",")
	user.Education = strings.Split(education, ",")
	user.Languages = strings.Split(languages, ",")
	c.JSON(http.StatusOK, user)
}

// CreateUser creates a new user
func CreateUser(c *gin.Context) {
	user:= User{}

	if err := c.Bind(&user); err != nil {
		fmt.Println("json decoding:", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{
			"error":  "json decoding : " + err.Error(),
			"status": http.StatusBadRequest,
		})
		return
	}

	if user.Name != "" && user.Resume != "" {
		targetColumnNames := structs.Names(&User{})
		insertUser := buildInsertStatement("userinfo", targetColumnNames[1:])
		err := DBInstance.DB.QueryRow(insertUser, user.Name, user.Email, user.Phone,
			strings.Join(user.Position, ","), strings.Join(user.Languages, ","), user.Referrer, user.Resume,
			strings.Join(user.Education, ","), user.Major, user.About, user.Skills,
			user.Ref1, user.Ref2, user.Ref3, false).Scan(&user.Id)
		if err != nil {
			fmt.Printf("Unable to insert query %s userinfo into db. Error message: %s\n", insertUser, err.Error())
			c.JSON(http.StatusServiceUnavailable, err.Error())
			return
		}

		fmt.Println("last inserted id =", user.Id)
		// return a pointer to the new user
		c.JSON(http.StatusOK, &user)
	} else {
		c.JSON(http.StatusUnprocessableEntity, errors.New("unable to find appropriate user keys"))
	}
}

func getJobs(country string) []*Job {
	jobs := make([]*Job, 0, 50)

	fmt.Println("Querying Jobs")
	targetColumnNames := structs.Names(&Job{})
	whereClause := fmt.Sprintf("expiration > '%s'", time.Now().Format("2006-01-02T15:04:05-0700"))
	if country != "" {
		whereClause += fmt.Sprintf(" and country = '%s'", country)
	}
	queryJobs := buildSelectStatement("jobs", targetColumnNames, whereClause)
	rows, err := DBInstance.DB.Query(queryJobs)
	if err != nil {
		fmt.Println("Unable to query jobs from db. Error message", err.Error())
		log.Fatalf("could not get jobs: %+v", err)
	}

	for rows.Next() {
		var languages string
		job := new(Job)
		err = rows.Scan(&job.Id, &job.Title, &job.Expiration, &job.Description, &job.Applicants, &job.Country, &languages)
		if err != nil {
			fmt.Println("Unable to scan job from db. Error message", err.Error())
			log.Fatalf("could not get job: %+v", err)
		}

		job.Languages = strings.Split(languages, ",")
		jobs = append(jobs, job)
	}

	return jobs
}

// JobsHandler retrieves a list of available jobs
func JobsHandler(c *gin.Context) {
	jobs = getJobs("")
	c.JSON(http.StatusOK, jobs)
}

func FilteredJobsHandler(c *gin.Context) {
	country := c.Param("country")
	jobs = getJobs(country)
	c.JSON(http.StatusOK, jobs)
}

// JobHandler retrieves a job
func JobHandler(c *gin.Context) {
	jobID := c.Param("jobID")
	job := new(Job)
	newJob := NewJob{job, getCountries()}

	if jobID == "undefined" {
		c.JSON(http.StatusOK, newJob)
		return
	}

	if m, _ := regexp.MatchString(`^([0-9]+)$`, jobID); !m {
		c.JSON(http.StatusUnprocessableEntity, "Please provide a valid jobID")
		return
	}

	c.Header("Content-Type", "application/json")

	fmt.Println("Querying Jobs")
	targetColumnNames := structs.Names(&Job{})
	whereClause := fmt.Sprintf("id = '%s';", jobID)
	queryUser := buildSelectStatement("jobs", targetColumnNames, whereClause)
	var languages string
	err := DBInstance.DB.QueryRow(queryUser).
		Scan(&job.Id, &job.Title, &job.Expiration, &job.Description, &job.Applicants, &job.Country, &languages)

	if job.Id == 0 {
		// JobID is invalid
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	if err != nil {
		fmt.Printf("Unable to run '%s' against table jobs in db. Error message: %s\n", queryUser, err.Error())
		c.JSON(http.StatusServiceUnavailable, err.Error())
		return
	}
	log.Printf("Retrieved job with ID: %d\n", job.Id)

	job.Languages = strings.Split(languages, ",")
	c.JSON(http.StatusOK, newJob)
}

// CreateJob creates a new job
func CreateJob(c *gin.Context) {
	job:= Job{}

	if err := c.Bind(&job); err != nil {
		fmt.Println("json decoding:", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{
			"error":  "json decoding : " + err.Error(),
			"status": http.StatusBadRequest,
		})
		return
	}

	if job.Title != "" && job.Description != "" {
		weeksToAdd, err := strconv.Atoi(job.Expiration)
		if err != nil {
			c.JSON(http.StatusUnprocessableEntity, errors.New("unable to convert expiration to int"))
			return
		}

		expiration := time.Now().AddDate(0, 0, 7 * weeksToAdd)

		targetColumnNames := structs.Names(&Job{})
		insertJob := buildInsertStatement("jobs", targetColumnNames[1:])
		err = DBInstance.DB.QueryRow(insertJob, job.Title, expiration.Format("2006-01-02T15:04:05-0700"),
			job.Description, 0, job.Country, strings.Join(job.Languages, ",")).Scan(&job.Id)
		if err != nil {
			fmt.Println("Unable to insert job into db. Error message", err.Error())
			c.JSON(http.StatusServiceUnavailable, err.Error())
			return
		}

		fmt.Println("last inserted id =", job.Id)
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
		var applicants sql.NullInt64
		jobsColumnNames := []string{"Applicants"}
		jobsQuery := buildSelectStatement("jobs", jobsColumnNames, fmt.Sprintf("id = %d", jobID))
		err := DBInstance.DB.QueryRow(jobsQuery).Scan(&applicants)
		if err != nil {
			fmt.Println("Unable to query jobs from db. Error message", err.Error())
			c.JSON(http.StatusServiceUnavailable, err.Error())
			return
		}

		// get updated jobs
		jobs = getJobs("")

		for i := 0; i < len(jobs); i++ {
			if jobs[i].Id == jobID {
				// get user info from email
				email := c.Request.FormValue("email")
				var user_id sql.NullInt64
				userinfoColumnNames := []string{"id"}
				whereClause := fmt.Sprintf("email = '%s';", email)
				queryUser := buildSelectStatement("userinfo", userinfoColumnNames, whereClause)
				err := DBInstance.DB.QueryRow(queryUser).Scan(&user_id)
				if err != nil {
					fmt.Println("Unable to query userinfo from db. Error message", err.Error())
					c.JSON(http.StatusServiceUnavailable, err.Error())
					return
				}

				// Insert into user_job join table
				_, err = DBInstance.DB.Exec("INSERT INTO user_job(user_id, job_id) VALUES($1, $2);", user_id.Int64, jobID)
				if err != nil {
					fmt.Println("Unable to insert into user_job in db. Error message", err.Error())
					c.JSON(http.StatusServiceUnavailable, err.Error())
					return
				}

				// update jobs table with applications received
				applicants.Int64 += 1
				jobs[i].Applicants = applicants.Int64
				_, err = DBInstance.DB.Exec("update jobs set applicants = $1 where id = $2;", applicants.Int64, jobID)
				if err != nil {
					fmt.Println("Unable to update applicants in jobs table in db. Error message", err.Error())
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

func CountriesHandler(c *gin.Context) {
	c.JSON(http.StatusOK, getCountries())
}

func getValueString(numberOfColumns int) string {
	values := "$1"
	for i := 1; i < numberOfColumns; i++ {
		values = fmt.Sprintf( "%s, $%d", values, i+1)
	}
	return values
}

func buildSelectStatement(targetTableName string, targetColumnNames []string, whereClause string) string {
	return fmt.Sprintf("SELECT %s from %s WHERE %s;", strings.Join(targetColumnNames, ","),
		targetTableName, whereClause)
}

func buildInsertStatement(targetTableName string, targetColumnNames []string) string {
	return fmt.Sprintf("INSERT INTO %s(%s) VALUES(%s) returning id;",
		targetTableName, strings.Join(targetColumnNames, ","), getValueString(len(targetColumnNames)))
}

func getCountries() []string {
	countries, err := ioutil.ReadFile("config/countries")
	if err != nil {
		log.Fatal("Cannot load countries file")
	}
	return strings.Split(string(countries), "\n")
}