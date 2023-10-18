import { Router } from 'express';
import MsTeamsController from '../controller/ms-teams.controller';
import { Routes } from '../interface/routes.interface';
import { validationMiddleware } from '@athena/shared/middleware';
import express from 'express';
// const express = require('express');
import helmet from 'helmet';
// import hpp from 'hpp';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { ORIGIN,CREDENTIALS } from '../config';
class MsTeamsRoute implements Routes {
  public path = '';
  public router = Router();
  public app: express.Application;
  public msTeamsController = new MsTeamsController();

  constructor() {
    this.app = express();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/getMeetingLink`,
      this.msTeamsController.scheduleMeeting
    );
    this.router.post(
      `${this.path}/cancel`,
      this.msTeamsController.cancelMeeting
    )
    this.router.post(
      `${this.path}/reschedule`,
      this.msTeamsController.rescheduleMeeting
    )
  }
  private initializeMiddlewares() {
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    // this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }
}

export default MsTeamsRoute;
