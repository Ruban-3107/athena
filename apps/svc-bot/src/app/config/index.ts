import { config } from 'dotenv';
config({ path: `.env` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  NODE_ENV,
  BOT_SERVICE_PORT,
  DB_HOST,
  DB_PORT,
  DB_CHATGPT_USER,
  DB_CHATGPT_PASSWORD,
  DB_CHATGPT_DATABASE,
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
  RESET_PASSWORD_KEY,
  CLIENT_URL,
  CHAP_GPT_API_KEY,
} = process.env;
