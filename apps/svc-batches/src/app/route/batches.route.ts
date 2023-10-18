import { Router } from 'express';
import BatchesController from '../controller/batches.controller';
import { CreateBatchesDto, updateBatchStatusDto } from '../dto/batches.dto';
import { Routes } from '../interface/routes.interface';
import { validationMiddleware } from '@athena/shared/middleware';
import authMiddleware from '../middleware/auth.middleware';

class BatchesRoute implements Routes {
  public path = '/batches';
  public router = Router();
  public batchesController = new BatchesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/:dateRangeType?`,
      authMiddleware,
      this.batchesController.getBatches
    );
    // this.router.get(`${this.path}/getBatch/:id(\\d+)`, authMiddleware, authorizationMiddleware(ActionConstants.READ, SubConstants.BATCH), this.batchesController.getBatchById);
    this.router.get(
      `${this.path}/getBatch/:id(\\d+)`,
      authMiddleware,
      this.batchesController.getBatchById
    );
    this.router.post(
      `${this.path}/searchBatch`,
      authMiddleware,
      // authorizationMiddleware(ActionConstants.READ, SubConstants.BATCH),
      this.batchesController.getBatchesBasedOnSearch
    );
    this.router.post(
      `${this.path}`,
      authMiddleware,
      validationMiddleware(CreateBatchesDto, 'body'),
      this.batchesController.createBatch
    );
    this.router.put(
      `${this.path}/:id(\\d+)`,
      validationMiddleware(CreateBatchesDto, 'body', true),
      this.batchesController.updateBatch
    );
    this.router.put(
      `${this.path}/:id(\\d+)/updatestatus`,
      validationMiddleware(updateBatchStatusDto, 'body', true),
      this.batchesController.updateBatchStatus
    );
    this.router.delete(
      `${this.path}/delete/batch`,
      this.batchesController.deleteBatch
    );
    // this.router.delete(`${this.path}`, this.batchesController.deleteBatch);
  }
}

export default BatchesRoute;
