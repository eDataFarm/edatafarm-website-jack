package main

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/auth0/go-jwt-middleware"
	"github.com/dgrijalva/jwt-go"
	"github.com/fatih/structs"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/spf13/viper"
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
	Languages 	string 		`db:"languages" form:"languages" binding:"required"`
	Referrer  	string 		`db:"referrer" form:"referrer"`
	Filename 	string 		`db:"file" form:"filename" binding:"required"`
	Resume 		string 		`db:"resume" form:"resume"`
	Education 	[]string	`db:"education" form:"education[]"`
	Major  		string 		`db:"major" form:"major"`
	Reference  	string 		`db:"reference" form:"reference" binding:"required"`
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
	Languages	[]string	`db:"languages" form:"languages[]"`
}

type NewJob struct {
	*Job
	Countries []string
	Languages []string
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

	// Set the router as the default one shipped with Gin
	router := gin.Default()

	// Set a lower memory limit for multipart forms (default is 32 MiB)
	router.MaxMultipartMemory = 8 << 20 // 8 MiB

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
		api.POST("/upload", UploadHandler)
		api.GET("/jobs/:jobID", JobHandler)
		api.GET("/jobs", JobsHandler)
		api.POST("/jobs", CreateJob)
		api.POST("/jobs/apply/:jobID", ApplyJob)
		api.GET("/countries", CountriesHandler)
		api.GET("/languages", LanguagesHandler)
	}

	// Read in a toml file or the 	env variables
	environment := os.Getenv("APP_ENVIRONMENT")
	if environment == "dev" || environment == "" {
		viper.SetConfigName("development")
		viper.SetConfigType("toml")
		viper.AddConfigPath("config")
		if err := viper.ReadInConfig(); err != nil {
			log.Println("Configuration file not found:", err.Error())
		}
	} else {
		viper.AutomaticEnv()
	}

	// [START setting_port]
	//To get from the toml file or env var
	port := viper.GetString("PORT")
	log.Printf("Listening on port %s", port)
	// [END setting_port]

	// Start and run the server
	router.Run(":" + port)
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
func mustGetenv(k string) string {
	v := os.Getenv(k)
	if v == "" {
		log.Panicf("%s environment variable not set.", k)
	}
	return v
}
func removeTables() error {
	removeJobs, err := ioutil.ReadFile("db/migrations/2_create_jobs.down.sql")
	if err != nil {
		return err
	}

	dropStmt := string(removeJobs)
	if _, err := DBInstance.DB.Exec(dropStmt); err != nil {
		return err
	}

	removeUsers, err := ioutil.ReadFile("db/migrations/1_create_users.down.sql")
	if err != nil {
		return err
	}

	dropStmt = string(removeUsers)

	if _, err := DBInstance.DB.Exec(dropStmt); err != nil {
		return err
	}

	return err
}
func createTables() error {
	createUsers, err := ioutil.ReadFile("db/migrations/1_create_users.up.sql")
	if err != nil {
		return err
	}

	stmt := string(createUsers)

	if _, err := DBInstance.DB.Exec(stmt); err != nil {
		return err
	}

	createJobs, err := ioutil.ReadFile("db/migrations/2_create_jobs.up.sql")
	if err != nil {
		return err
	}

	stmt = string(createJobs)
	if _, err := DBInstance.DB.Exec(stmt); err != nil {
		return err
	}

	return err
}
// Initialize the DBInstance singleton for server connections
func initDB() {
	dbOnce.Do(func () {
		var (
			password       = os.Getenv("CLOUDSQL_PASSWORD") // NOTE: password may be empty
			socket         = os.Getenv("CLOUDSQL_SOCKET_PREFIX")
		)

		// PostgresSQL Connection
		dbURI := fmt.Sprintf("user=postgres password=%s dbname=%s sslmode=disable", password, DBName)

		// /cloudsql is used on App Engine.
		if socket != "" {
			connectionName := mustGetenv("CLOUDSQL_CONNECTION_NAME")
			user           := mustGetenv("CLOUDSQL_USER")
			dbURI = fmt.Sprintf("user=%s password=%s host=/cloudsql/%s dbname=%s", user, password, connectionName, DBName)
			socket = "/cloudsql"
		}

		db, err := sql.Open("postgres", dbURI)
		if err != nil {
			log.Fatalln("Failed to open connection to db: ", err.Error())
		}

		DBInstance = &DBType{DB: db}

		// Running an SQL query also checks the connection to the PostgreSQL server is authenticated and valid.
		// Uncomment to run down migrations
		//if err := removeTables(); err != nil {
		//	log.Fatal(err)
		//}
		// Ensure the table exists.
		if err := createTables(); err != nil {
			log.Fatal(err)
		}
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
		whereClause = fmt.Sprintf("id in(SELECT user_id from user_job where job_id = %s)", jobID)
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
		var education, position string
		err = rows.Scan(&user.Id, &user.Name, &user.Email, &user.Phone, &position, &user.Languages, &user.Referrer,
			&user.Filename, &user.Resume, &education, &user.Major, &user.Reference, &user.Admin)
		if err != nil {
			fmt.Println("Unable to scan userinfo from db. Error message", err.Error())
			c.JSON(http.StatusServiceUnavailable, err.Error())
			return
		}

		user.Position = strings.Split(position, ",")
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
	var education, position string
	targetColumnNames := structs.Names(&User{})
	whereClause := fmt.Sprintf("email = '%s'", email)
	queryUser := buildSelectStatement("userinfo", targetColumnNames, whereClause)
	err := DBInstance.DB.QueryRow(queryUser).
		Scan(&user.Id, &user.Name, &user.Email, &user.Phone, &position, &user.Languages, &user.Referrer,
			&user.Filename, &user.Resume, &education, &user.Major, &user.Reference, &user.Admin)

	if user.Email == "" {
		// User email is invalid
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	if err != nil {
		fmt.Printf("Unable to run '%s' against table userinfo in db. Error message: %s\n", queryUser, err.Error())
		c.JSON(http.StatusServiceUnavailable, err.Error())
		return
	}

	user.Position = strings.Split(position, ",")
	user.Education = strings.Split(education, ",")
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

	if user.Name != "" && user.Email != "" {
		targetColumnNames := structs.Names(&User{})
		insertUser := buildUpsertStatement("userinfo", targetColumnNames[1:], "email")
		execParams := make([]interface{}, 0, 50)
		execParams = append( execParams, user.Name, user.Email, user.Phone,
			strings.Join(user.Position, ","), user.Languages, user.Referrer, user.Filename, user.Resume,
			strings.Join(user.Education, ","), user.Major, user.Reference, false)
		// Need values twice for upsert statement parameters
		execParams = append(execParams, execParams...)

		stmt, err := DBInstance.DB.Prepare(insertUser)
		if err != nil {
			fmt.Printf("Unable to insert query %s userinfo into db. Error message: %s\n", insertUser, err.Error())
			c.JSON(http.StatusServiceUnavailable, err.Error())
			return
		}
		defer stmt.Close()

		_, err = stmt.Exec(execParams...)
		if err != nil {
			fmt.Printf("Unable to insert query %s userinfo into db. Error message: %s\n", insertUser, err.Error())
			c.JSON(http.StatusServiceUnavailable, err.Error())
			return
		}

		// return a pointer to the new user
		c.JSON(http.StatusOK, &user)
	} else {
		c.JSON(http.StatusUnprocessableEntity, errors.New("unable to find appropriate user keys"))
	}
}

// UploadHandle saves resume to disk
func UploadHandler(c *gin.Context) {
	// Source
	file, err := c.FormFile("file")
	if err != nil {
		c.String(http.StatusBadRequest, fmt.Sprintf("get form err: %s", err.Error()))
		return
	}

	if err := c.SaveUploadedFile(file, "views/user/resumes/" + file.Filename); err != nil {
		c.String(http.StatusBadRequest, fmt.Sprintf("upload file err: %s", err.Error()))
		return
	}

	c.String(http.StatusOK, fmt.Sprintf("File %s uploaded successfully", file.Filename))
}

func getJobs(country, language string) []*Job {
	jobs := make([]*Job, 0, 50)

	fmt.Println("Querying Jobs")
	targetColumnNames := structs.Names(&Job{})
	whereClause := fmt.Sprintf("expiration > '%s'", time.Now().Format("2006-01-02T15:04:05-0700"))
	if country != "" && country != "All Countries" {
		whereClause += fmt.Sprintf(" and country = '%s'", country)
	}
	if language != "" && language != "All Languages" {
		whereClause += fmt.Sprintf(" and languages like '%%%s%%'", language)
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
	country := c.DefaultQuery("country", "")
	language := c.DefaultQuery("language", "")
	jobs = getJobs(country, language)
	c.JSON(http.StatusOK, jobs)
}

// JobHandler retrieves a job
func JobHandler(c *gin.Context) {
	jobID := c.Param("jobID")
	job := new(Job)
	newJob := NewJob{job, getCountries(), getLanguages()}

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
	whereClause := fmt.Sprintf("id = '%s'", jobID)
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
		jobs = getJobs("", "")

		for i := 0; i < len(jobs); i++ {
			if jobs[i].Id == jobID {
				// get user info from email
				email := c.Request.FormValue("email")
				var user_id sql.NullInt64
				userinfoColumnNames := []string{"id"}
				whereClause := fmt.Sprintf("email = '%s'", email)
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

func LanguagesHandler(c *gin.Context) {
	c.JSON(http.StatusOK, getLanguages())
}

func getValueString(numberOfColumns int) string {
	values := "$1"
	for i := 1; i < numberOfColumns; i++ {
		values = fmt.Sprintf( "%s, $%d", values, i+1)
	}
	return values
}

func buildSelectStatement(targetTableName string, targetColumnNames []string, whereClause string) string {
	return fmt.Sprintf("SELECT %s from %s WHERE %s ORDER BY id;", strings.Join(targetColumnNames, ","),
		targetTableName, whereClause)
}

func getSetString(targetColumnNames []string) string {
	setStatement := ""
	position := len(targetColumnNames)
	for index, column := range targetColumnNames {
		if index > 0 {
			setStatement += ", "
		}
		setStatement += fmt.Sprintf("%s = $%d", column, position + index + 1)
	}

	return setStatement
}

func buildInsertStatement(targetTableName string, targetColumnNames []string) string {
	return fmt.Sprintf("INSERT INTO %s(%s) VALUES(%s) returning id;",
		targetTableName, strings.Join(targetColumnNames, ","), getValueString(len(targetColumnNames)))
}

func buildUpsertStatement(targetTableName string, targetColumnNames []string, conflictColumn string) string {
	return fmt.Sprintf("INSERT INTO %s(%s) VALUES(%s) ON CONFLICT (%s) DO UPDATE SET %s;",
		targetTableName, strings.Join(targetColumnNames, ","), getValueString(len(targetColumnNames)),
		conflictColumn, getSetString(targetColumnNames))
}

func getCountries() []string {
	countries, err := ioutil.ReadFile("config/countries")
	if err != nil {
		log.Fatal("Cannot load countries file")
	}
	return strings.Split(string(countries), "\n")
}

func getLanguages() []string {
	languages, err := ioutil.ReadFile("config/languages")
	if err != nil {
		log.Fatal("Cannot load languages file")
	}
	return strings.Split(string(languages), "\n")
	//returnArray := make([]map[int]string, 0, len(languagesArray))
	//for index, language := range languagesArray {
	//	m := make(map[int]string)
	//	m[index] = language
	//	returnArray = append(returnArray, m)
	//}
	//return returnArray
}
