# PixelStreaming TheDuchy Backend API

## Installation

```bash
$ npm install
```

## Start postgresql locally and set up db

```bash
> brew services start postgresql
> psql postgres

postgres=# create role ProjectName with password '123456';
CREATE ROLE
postgres=# alter role ProjectName login superuser inherit createdb createrole replication;
ALTER ROLE
postgres=# create database ProjectName;
CREATE DATABASE
postgres=# grant all privileges on database ProjectName to ProjectName;
GRANT
postgres=# grant all privileges on all tables in schema public to ProjectName;
GRANT
postgres=# \q

or download postgresql app
https://www.postgresql.org/download/
setup the login user
Add the new database

change the .env file
DATABASE_USER=<db user name>
DATABASE_PASSWORD=<db password>
DATABASE_NAME=<dbname>
DATABASE_HOST=<host url>

```

### Alternative Postgres run with Docker

If you are familiar with docker and you don't want to install postgres, you can use `docker-compose` to spin up the database. Simply run the following:

```bash
docker-compose up

# optional: to view the database data
# go to http://localhost:8098
# select system = db, username = postgres,
# password = 123456, database = dbname
```

## Prepare terminal with environment variables

```bash
# make a copy of environment variables
$ cp .env.sample .env

# edit .env with an editor, eg vim
$ vim .env

# add to environment
$ source .env
```

Edit values to reflect local configuration environment

## Run migrations

```bash

$ npm run migrate:up
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

View API docs at http://localhost:3001/api or download json for import into postman with
http://localhost:3001/api-json

## Deploy your application to Heroku

```bash
$ git add .
$ git commit -am "commit"
$ git push heroku main
```

### pm2 serve

```bash
$ pm2 start dist/main.js --name <application_name>
$ pm2 startup systemd
$ pm2 save
```
