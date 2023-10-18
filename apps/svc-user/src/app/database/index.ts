// export * from './lib/shared\\database\\models';

import { Sequelize } from 'sequelize';
import {
  NODE_ENV,
  DB_HOST,
  DB_PORT,
  DB_USER_USER,
  DB_USER_PASSWORD,
  DB_USER_DATABASE,
} from '../config';
//export const { NODE_ENV, PORT, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN, SUPABASE_URL, SUPABASE_ANON_KEY,GITHUB_TOKEN,GIT_URL,GIT_LOCAL_PATH,REDIS_HOST,REDIS_PORT,REDIS_DATABASE } = process.env;
import { initModels } from './models/models';
//import { FORCE } from 'sequelize/types/index-hints';
// console.log('Hiiiiiiiiiiiiiiiiiiiiiiiii', DB_USER_DATABASE);
console.log('process.env.DB_DATABASE====>user', DB_USER_DATABASE);


const sequelize = new Sequelize(
  DB_USER_DATABASE ? DB_USER_DATABASE : '',
  DB_USER_USER ? DB_USER_USER : '',
  DB_USER_PASSWORD,
  {
    dialect: 'postgres',
    host: DB_HOST,
    port: Number(DB_PORT),
    define: {
      charset: 'unicode',
      underscored: true,
      freezeTableName: true,
    },
    pool: {
      min: 0,
      max: 3,
    },
    logQueryParameters: NODE_ENV === 'development',
    logging: false,
    benchmark: true,
  }
);

(async function establishDB() {
  try {
    await sequelize.authenticate();
    console.log(
      'Connection has been established successfully.',
      'On database==>',
      sequelize.config.database
    );
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

sequelize.sync();

const DB = {
  // Tracks: new tracks(sequelize),
  DBmodels: initModels(sequelize),
  sequelize, // connection instance (RAW queries)
  Sequelize, // library
};

export default DB;
