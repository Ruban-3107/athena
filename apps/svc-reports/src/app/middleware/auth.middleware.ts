// import { authMiddleware } from '@athena/shared/middleware';

// export { authMiddleware };
import { apiRequestHandler } from '@athena/shared/common-functions';
import { NextFunction, Request, Response } from 'express';
import {  USERS_SERVICE_PORT, AUTH_PATH, USERS_SERVICE_URL } from '../config/index';
import { HttpException } from '@athena/shared/exceptions';

const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.split('Bearer ')[1];
        // console.log("ssssssssss", token);
        const authRes = await apiRequestHandler(
            `${USERS_SERVICE_URL}:${USERS_SERVICE_PORT}${AUTH_PATH}`, token,
            'GET',
            null
        );
        console.log("aaaaaaaaaaa", authRes);
        if (authRes?.status === "success") {
            req.user = authRes?.value;
            req.token = token;
            next();
        }
        else {
            next(new HttpException(401, 'Unauthorized'));
        }
    } catch (err) {
        console.log(err);
        next(new HttpException(401, 'Unauthorized'));
    }
};
export default authMiddleware;
