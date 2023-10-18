// import { authMiddleware } from '@athena/shared/middleware';

// export { authMiddleware };
import { apiRequestHandler } from '@athena/shared/common-functions';
import { NextFunction, Request, Response } from 'express';
import { USERS_SERVICE_PORT, PATHS, USERS_SERVICE_URL } from '../config/index';
import { HttpException } from '@athena/shared/exceptions';

const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.split('Bearer ')[1];
    console.log('ssssssssss', token);
    console.log('eerrererreeeeeeeeeee');
    const authRes = await apiRequestHandler(
      `${USERS_SERVICE_URL}:${USERS_SERVICE_PORT}${PATHS.AUTH}`,
      token,
      'GET',
      null
    );
    // console.log("aaaaaaaaaaa", authRes);
    if (authRes?.status === 'success') {
      req.user = authRes?.value;
      req.token = token;
      next();
      return;
    } else {
      next(new HttpException(401, 'Unauthorized'));
    }
  } catch (err) {
    console.log('uyiyiiuiiu', err);
    next(new HttpException(401, 'Unauthorized'));
  }
};
export default authMiddleware;
