# Golang app with the Gin framework, and authenticate with Auth0 + JWT

This repo contains the code built for [eDataFarm](http://www.edatafarm.com).

## Setup

1. Update the `main.go` file with your Auth0 Credentials. [Sign up](https://auth0.com) for an account for free if you don't have one.
2. Update the `views/app.jsx` file with your Auth0 Credentials.
3. Add `http://localhost:3000` to your Allowed Callback, and Allowed Logout URL's in your [Auth0 Management Dashboard](https://manage.auth0.com).
4. Run `mv .env.sample .env` and update with valid credentials
5. Source the environment variables - `source .env`
6. Update dependencies `go get`
7. Install postgresql database `brew install postgresql`
8. Create the database `createdb edatafarm`
9. Load the schema for users` psql  edatafarm < db/migrations/create_users`
10. Load the schema for jobs` psql  edatafarm < db/migrations/create_jobs`
11. Launch the application by running `go run main.go`
12. Navigate to `localhost:3000` to view the application
