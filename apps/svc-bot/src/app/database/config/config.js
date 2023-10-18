require('dotenv').config();

module.exports = {
  "development": {
    "username": "athena_chatgpt",
    "password": "athena-chatgpt-pwd",
    "database": "athena_chatgpt_db",
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