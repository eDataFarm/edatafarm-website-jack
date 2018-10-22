#!/bin/bash
createdb edatafarm
psql edatafarm edatafarm < db/migrations/create_users
psql edatafarm edatafarm < db/migrations/create_jobs
go get -d ./...
go build -o bin/main main.go
