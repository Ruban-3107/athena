import { plainToInstance } from 'class-transformer';

import { validate, ValidationError } from 'class-validator';

import { RequestHandler } from 'express';

import { responseCF, bodyCF } from '../../../../commonResponse/commonResponse';
export default function validationMiddleware(
  type: any,
  value: 'body' | 'query' | 'params' = 'body',
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true
): RequestHandler {
  return (req, res, next) => {
    validate(plainToInstance(type, req[value]), {
      skipMissingProperties,
      whitelist,
      forbidNonWhitelisted,
    }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors.flatMap((error: ValidationError) => {
          return Object.values(error.constraints || {});
        });
        const resp = responseCF(
          bodyCF({ message: message, code: '611', status: 'error' })
        );
        return res.send(resp);
      } else {
        next();
      }
    });
  };
}
