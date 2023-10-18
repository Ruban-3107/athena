require('dotenv').config();

module.exports = {
  "development": {
    "username": "athena_user",
    "password": "athena-users-pwd",
    "database": "athena_users_db",
    "host": "bassure.in",
    "dialect": 'postgres'
  },
  "test": {
    "username": process.env.USERNAME,
    "password": process.env.PASSWORD,
    "database": process.env.DATABASE,
    "host": process.env.HOST
  },
  "production": {
    "username": process.env.USERNAME,
    "password": process.env.PASSWORD,
    "database": process.env.DATABASE,
    "host": process.env.HOST
  }

}