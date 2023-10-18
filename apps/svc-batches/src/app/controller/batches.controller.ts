import { NextFunction, Request, Response } from 'express';
import { CreateBatchesDto, updateBatchStatusDto } from '../dto/batches.dto';
import { Batches } from '../interface/batches.interface';
import BatchesService from '../service/batches.service';
import { SECRET_KEY } from '../config/index';
import jwt from 'jsonwebtoken';
import {
  responseCF,
  bodyCF,
  codeValue,
} from '../../../../../libs/commonResponse/commonResponse';
import { RequestWithUser } from '../interface/routes.interface';

class BatchesController {
  public BatchesService = new BatchesService();

  public getBatches = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log('----het');

      const dateRangeType = req.params.dateRangeType ?? null;
      const findAllBatchesData: Batches[] =
        await this.BatchesService.findAllBatchesWithoutPagination(
          dateRangeType
        );

      const response = responseCF(
        bodyCF({
          val: { batchData: findAllBatchesData },
          code: codeValue.success,
          status: 'success',
        })
      );

      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: codeValue.error,
          status: 'error',
        })
      );
      console.log(error);
      return res.json(response);
    }
  };

  public getBatchById = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // console.log('???????????????', req);
      const token: any = req.token;
      const batchId = Number(req.params.id);
      // console.log('?????????grt??????', batchId);
      const findOneBatchData: Batches =
        await this.BatchesService.findBatchesById(batchId, token);
      const response = responseCF(
        bodyCF({
          val: { batchData: findOneBatchData },
          code: 'searchAPI',
          status: 'success',
        })
      );

      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: codeValue.error,
          status: 'false',
        })
      );
      console.log(error);
      return res.json(response);
    }
  };

  public getBatchesBasedOnSearch = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (req.body.searchkey) {
        console.log('here');
        const foundBatchesData: Batches[] =
          await this.BatchesService.searchBatches(req.body);
        const response = responseCF(
          bodyCF({
            val: { batchData: foundBatchesData },
            code: '600',
            status: 'success',
          })
        );

        return res.json(response);
      } else {
        console.log(req, 'hi:::');

        const foundBatchesData: Batches[] =
          await this.BatchesService.findAllBatches(req.body, req.token);
        const response = responseCF(
          bodyCF({
            val: { batchData: foundBatchesData },
            code: '601',
            status: 'success',
          })
        );
        return res.json(response);
      }
    } catch (error) {
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: codeValue.error,
          status: 'error',
        })
      );
      console.log(error);
      return res.json(response);
    }
  };

  public createBatch = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const batchData: CreateBatchesDto = req.body;
      const userDataFromToken: any = req.user;
      const token: any = req.token;
      console.log('rrrrrrrrr', batchData);
      const createBatchData: Batches = await this.BatchesService.createBatches(
        batchData,
        userDataFromToken,
        token
      );

      const response = responseCF(
        bodyCF({
          val: { batchData: createBatchData },
          code: 'searchAPI',
          status: 'success',
        })
      );

      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: codeValue.error,
          status: 'false',
        })
      );
      console.log(error);
      return res.json(response);
    }
  };

  public updateBatch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const batchId = Number(req.params.id);
      const batchData: CreateBatchesDto = req.body;
      const updateBatchData: Batches = await this.BatchesService.updateBatches(
        batchId,
        batchData
      );

      const response = responseCF(
        bodyCF({
          val: { batchData: updateBatchData },
          code: 'searchAPI',
          status: 'success',
        })
      );

      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: codeValue.error,
          status: 'false',
        })
      );
      console.log(error);
      return res.json(response);
    }
  };

  public updateBatchStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const batchId = Number(req.params.id);
      const batchData: updateBatchStatusDto = req.body;
      console.log('dddddddddd', req.params, req.body);
      const updateBatchData: Batches =
        await this.BatchesService.updateBatchStatus(batchId, batchData);

      const response = responseCF(
        bodyCF({
          val: { batchData: updateBatchData },
          code: 'searchAPI',
          status: 'success',
        })
      );

      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: codeValue.error,
          status: 'false',
        })
      );
      console.log(error);
      return res.json(response);
    }
  };

  public deleteBatch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req.body.ids, 'DELETEIDS');

      const batchIds = req.body.ids;
      const authHeader = req.headers.authorization;
      const jwtToken = authHeader.split(' ')[1];
      const secret = SECRET_KEY;
      const decoded = jwt.verify(jwtToken, secret);
      const deletedBy = decoded['id'];
      console.log('//////////', batchIds, deletedBy);
      const promises = batchIds.map(async (batchId) => {
        const deletedBatch = await this.BatchesService.deleteBatch(
          batchId,
          deletedBy
        );
        return { id: batchId, topic: deletedBatch };
      });
      // Waits for all promises to resolve
      const deletedTopics = await Promise.all(promises);

      const response = responseCF(
        bodyCF({
          val: { userData: deletedTopics },
          code: '600',
          status: 'success',
          message: 'Batches deleted successfully',
        })
      );
      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: codeValue.error,
          status: 'error',
        })
      );
      console.log(error);
      return res.json(response);
    }
  };
}

export default BatchesController;
