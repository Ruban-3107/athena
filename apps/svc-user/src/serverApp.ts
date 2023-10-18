import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
// const express = require('express');
import helmet from 'helmet';
// import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import {
  NODE_ENV,
  USERS_SERVICE_PORT,
  LOG_FORMAT,
  ORIGIN,
  CREDENTIALS,
} from './app/config';
import DB from '../src/app/database/index';
import { Routes } from './app/interface/routes.interface';
import { errorMiddleware } from './app/middleware/error.middleware';
import { logger, stream } from './app/util/loggers';
import ResponseError from '../../../libs/shared/modules/src/lib/Response/ResponseError';
import { MessageQueue } from './app/util/message.queue';
//import { cron } from 'node-cron';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public messageQueue = new MessageQueue();

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = USERS_SERVICE_PORT || 3000;

    this.connectToDatabase();
    this.initializeMiddleware();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
    this.connectRedis()
  }

  public listen() {
    console.log(`Listening at http://localhost:${this.port}/api`);

    this.app.listen(this.port, () => {
      console.log(`Listening Users at http://localhost:${this.port}/api`);
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 Users App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  public connectRedis(){
    this.messageQueue.connect();
  }

  private connectToDatabase() {
    DB.sequelize.sync({ force: false });
  }

  private initializeMiddleware() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    // this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use('/api/users', route.router);
    });

    this.app.use('*', function (req, res) {
      console.log('reee', req.url);
      throw new ResponseError.NotFound(
        `Sorry, HTTP resource you are looking for was not found.`
      );
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
