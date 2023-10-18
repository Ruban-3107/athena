import { config } from 'dotenv';
config({ path: `.env` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  NODE_ENV,
  SECRET_KEY,
  BATCH_PORT,
  USERS_PORT,
  DB_HOST,
  DB_PORT,
  COURSES_PORT,
  HOST_IP,
  LOG_DIR,
  LOG_FORMAT,
  ORIGIN,
} = process.env;

