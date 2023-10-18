import { config } from 'dotenv';
config({ path: `.env` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  NODE_ENV,
  USERS_SERVICE_PORT,
  DB_HOST,
  DB_PORT,
  SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  GITHUB_TOKEN,
  GIT_URL,
  GIT_LOCAL_PATH,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_DATABASE,
  COURSES_PORT,
  HOST_IP,
  COURSES_SERVICE_URL,
  RESET_PASSWORD_KEY,
  CLIENT_URL,
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET,
  AWS_ENDPOINT,
  DB_USER_USER,
  DB_USER_PASSWORD,
  DB_USER_DATABASE,
  HOST_IP_FRONT,
  COURSES_SERVICE_PORT,
  REDIS_PUB_NOTIFICATION,
  REDIS_PASSWORD,
  


} = process.env;

export const ACTIVITIES_LOG_URL = `api/courses/activities/create/activities`;

// http://localhost:3001/api/courses/activities/create/activities
