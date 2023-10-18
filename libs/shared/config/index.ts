import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
    NODE_ENV,
    PORT,
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
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_REGION,
    AWS_BUCKET,
    AWS_ENDPOINT,
    UNOSERVER_URL,
} = process.env as { [key: string]: string };
