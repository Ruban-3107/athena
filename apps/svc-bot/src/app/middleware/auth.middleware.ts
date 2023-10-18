// import { NextFunction, Response, Request } from 'express';
// import { sign, verify } from 'jsonwebtoken';
// import { SECRET_KEY } from '../config/index';
// import DB from '../database/index';
// import { HttpException } from '@athena/shared/exceptions';
// import { RequestWithUser } from '../interface/auth.interface';
// import { responseCF, bodyCF } from '../../../../../libs/commonResponse/commonResponse';

// const roles = DB.DBmodels.roles;

// /**
//  * Authentication Middleware
//  * This middleware validates the user's authentication token and sets the user information in the request object.
//  * @param req The request object
//  * @param res The response object
//  * @param next The next middleware function
//  */

// export const authMiddlewareForApi = async (
//   req: RequestWithUser,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     console.log('auth middleware called:::::::::::');

//     // Extract the Authorization token from the request
//     const Auth =
//       req.cookies['Authorization'] ||
//       (req.header('Authorization')
//         ? req.header('Authorization')?.split('Bearer ')[1]
//         : null);
//     console.log('auth:::::::', Auth);

//     if (Auth) {
//       const secretKey: any = SECRET_KEY;
//       try {
//         // Verify the token and extract the user ID
//         const access_uid: any = verify(Auth, secretKey);

//         // Find the user in the database based on the user ID
//         const findUser: any = await DB.DBmodels.users.findOne({
//           where: { id: access_uid.id },
//           include: [
//             {
//               model: roles,
//               as: 'userRoles',
//             },
//           ],
//         });

//         if (findUser) {
//           // Set the user and token in the request object
//           req.user = findUser || undefined;
//           req.token = Auth;

//           // Send a success response
//           const response = responseCF(
//             bodyCF({
//               code: "600",
//               status: 'success',
//               message: 'Authentication successful',
//               val: findUser
//             })
//           );
//           return res.json(response);
//         } else {
//           // User not found, return unauthorized error
//           const resp = responseCF(
//             bodyCF({ message: 'Unauthorized', code: '611', status: 'error' })
//           );
//           // console.log('resp.body::::::::::', resp.body);
//           next(new HttpException(401, 'Unauthorized'));
//         }
//         next();
//       } catch (e) {
//         // Token verification failed, return unauthorized error
//         next(new HttpException(401, 'Unauthorized'));
//         console.log('error:::::', e);
//       }
//     } else {
//       // No token provided, return unauthorized error
//       const resp = responseCF(
//         bodyCF({ message: 'Unauthorized', code: '401', status: 'error' })
//       );
//       console.log('resp.body::::::::::', resp.body);

//       next(new HttpException(401, 'Unauthorized'));
//     }
//   } catch (error) {
//     // Error occurred, return unauthorized error
//     const resp = responseCF(
//       bodyCF({ message: 'Unauthorized', code: '611', status: 'error' })
//     );
//     next(new HttpException(401, 'Unauthorized'));
//   }
// };

// export const authMiddleware = async (
//   req: RequestWithUser,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     console.log('auth middleware called:::::::::::');

//     // Extract the Authorization token from the request
//     const Auth =
//       req.cookies['Authorization'] ||
//       (req.header('Authorization')
//         ? req.header('Authorization')?.split('Bearer ')[1]
//         : null);
//     console.log('auth:::::::', Auth);

//     if (Auth) {
//       const secretKey: any = SECRET_KEY;
//       try {
//         // Verify the token and extract the user ID
//         const access_uid: any = verify(Auth, secretKey);

//         // Find the user in the database based on the user ID
//         const findUser: any = await DB.DBmodels.users.findOne({
//           where: { id: access_uid.id },
//           include: [
//             {
//               model: roles,
//               as: 'userRoles',
//             },
//           ],
//         });

//         if (findUser) {
//           // Set the user and token in the request object
//           req.user = findUser || undefined;
//           req.token = Auth;
//         } else {
//           // User not found, return unauthorized error
//           const resp = responseCF(
//             bodyCF({ message: 'Unauthorized', code: '611', status: 'error' })
//           );
//           console.log('resp.body::::::::::', resp.body);
//           next(new HttpException(401, 'Unauthorized'));
//         }
//         next();
//       } catch (e) {
//         // Token verification failed, return unauthorized error
//         next(new HttpException(401, 'Unauthorized'));
//         console.log('error:::::', e);
//       }
//     } else {
//       // No token provided, return unauthorized error
//       const resp = responseCF(
//         bodyCF({ message: 'Unauthorized', code: '401', status: 'error' })
//       );
//       console.log('resp.body::::::::::', resp.body);

//       next(new HttpException(401, 'Unauthorized'));
//     }
//   } catch (error) {
//     // Error occurred, return unauthorized error
//     const resp = responseCF(
//       bodyCF({ message: 'Unauthorized', code: '611', status: 'error' })
//     );
//     next(new HttpException(401, 'Unauthorized'));
//   }
// };