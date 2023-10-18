import { config } from 'dotenv';
config({ path: `.env` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  NODE_ENV,
  SECRET_KEY,
  BATCHES_SERVICE_PORT,
  USERS_SERVICE_PORT,
  DB_HOST,
  DB_PORT,
  DB_BATCH_USER,
  DB_BATCH_PASSWORD,
  DB_BATCH_DATABASE,
  COURSES_SERVICE_PORT,
  USERS_SERVICE_URL,
  COURSES_SERVICE_URL,
  LOG_DIR,
  LOG_FORMAT,
  ORIGIN,
  NOTIFICATION_SERVICE_PORT,
  sendpath,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PUB_NOTIFICATION,
  REDIS_PUB_NOTIFICATION_1,
  REDIS_PASSWORD
  
} = process.env;



export const PATHS = {
//   CHAPTER_TOPIC: 'api/courses/topics/throughchapter',
//   TRACK_CHAPTER: 'api/courses/chapters/throughtrack',
//   TRACK_CHILDREN: 'api/courses/tracks/childthroughtrack',
//   GETUSERS: 'api/users/getusers/all',
//   GETCLIENTS: 'api/users/clients/getclients/all',
//   AUTH: '/api/users/getAuth',
};
