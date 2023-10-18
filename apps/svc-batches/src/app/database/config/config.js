require('dotenv').config();

module.exports = {
  "development": {
    "username": "athena_batch",
    "password": "athena-batch-pwd",
    "database": "athena_batches_db",
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