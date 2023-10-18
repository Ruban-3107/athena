import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
    NODE_ENV,
    USERS_PORT,
    AUTH_PORT,
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_DATABASE,
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
    ASSESSMENT_PORT,
    RESET_PASSWORD_KEY,
    CLIENT_URL,
    AWS_ACCESS_KEY_ID,
    AWS_REGION,
    AWS_SECRET_ACCESS_KEY,
    AWS_BUCKET,
    AWS_ENDPOINT,
    HOST_IP,
    
} = process.env;
