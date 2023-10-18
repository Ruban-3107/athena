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
  HOST_IP_FRONT,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PUB_NOTIFICATION,
  REDIS_PUB_NOTIFICATION_1,
  MS_TEAMS_SERVICE_PORT,
  MS_TEAMS_URL,
  REDIS_PASSWORD
  
} = process.env;

export const GET_TRACKS_ROUTE = '/api/courses/tracks';
export const GET_USERS_ROUTE = '/api/users';
export const GET_AUTH_ROUTE = '/api/users/getAuth';
export const GET_TOPICBYID = '/api/courses/topics'
export const GET_TEMPLATE = '/api/users/template/getTemplate'
export const GET_TOKEN_BYID = '/api/users/getTokenById'
export const MS_TEAM_ROUTE ='/api/msteams'

export const PATHS = {
  CHAPTER_TOPIC: 'api/courses/topics/throughchapter',
  TRACK_CHAPTER: 'api/courses/chapters/throughtrack',
  TRACK_CHILDREN: 'api/courses/tracks/childthroughtrack',
  GETUSERS: 'api/users/getusers/all',
  GETCLIENTS: 'api/users/clients/getclients/all',
  AUTH: '/api/users/getAuth',
};
