import { Router } from 'express';
import SchedulesController from '../controller/schedules.controller';
import { CreateScheduleDto } from '../dto/schedules.dto';
import { Routes } from '../interface/routes.interface';
import { validationMiddleware } from '@athena/shared/middleware';
import authMiddleware from '../middleware/auth.middleware';
class SchedulesRoute implements Routes {
  public path = '/schedules';
  public router = Router();
  public schedulesController = new SchedulesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      authMiddleware,
      this.schedulesController.getSchedules
    );
    this.router.get(
      `${this.path}/:type/:id`,
      authMiddleware,
      this.schedulesController.getScheduleByBatchId
    );
    this.router.get(
      `${this.path}/:unique_id`,
      authMiddleware,
      this.schedulesController.getScheduleByUnqId
    );
    this.router.post(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(CreateScheduleDto, 'body'),
      this.schedulesController.createSchedule
    );
    this.router.put(
      `${this.path}/:unq_id`,
      authMiddleware,
      validationMiddleware(CreateScheduleDto, 'body', true),
      this.schedulesController.updateSchedule
    );
    this.router.delete(
      `${this.path}/:id(\\d+)`,
      authMiddleware,
      this.schedulesController.deleteSchedule
    );
  }
}

export default SchedulesRoute;
