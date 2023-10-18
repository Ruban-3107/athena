import { config } from 'dotenv';
config({ path: `.env` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  NODE_ENV,
  USERS_SERVICE_PORT,
  BOT_SERVICE_PORT,
  DB_HOST,
  DB_PORT,
  DB_COURSE_USER,
  DB_COURSE_PASSWORD,
  DB_COURSE_DATABASE,
  SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  GITHUB_TOKEN,
  GIT_URL,
  GIT_LOCAL_PATH,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_DATABASE,
  COURSES_SERVICE_PORT,
  STRAPI_URL,
  USERS_SERVICE_URL,
  COURSES_SERVICE_URL,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_BUCKET,
  AWS_ENDPOINT,
} = process.env;

export const PATHS = {
  CHAPTER_TOPIC: 'api/courses/topics/throughchapter',
  TRACK_CHAPTER: 'api/courses/chapters/throughtrack',
  TRACK_CHILDREN: 'api/courses/tracks/childthroughtrack',
  GETUSERS: 'api/users/getusers/all',
  AUTH: '/api/users/getAuth',
};
