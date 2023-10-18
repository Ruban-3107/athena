import { validationMiddleware } from '@athena/shared/middleware';
// import { RequestHandler } from 'express';

function sampleMiddleware(req, res, next) {
  console.log('sample middleware for validation-svc-courses');
  next();
}

export {
   validationMiddleware,
  sampleMiddleware,
};
