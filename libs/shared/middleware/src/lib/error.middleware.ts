import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@athena/shared/exceptions';
import { logger } from '@athena/shared/logger';
import { responseCF, bodyCF } from '../../../../commonResponse/commonResponse';

const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("errrr",req.url, error, error.status);
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';
    logger.error(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`
    );
    const resp = responseCF(
      bodyCF({ message: message, code: '611', status: 'error' })
    );
    return res.send(resp);
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
