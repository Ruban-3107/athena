// import { NextFunction, Response, Request } from 'express';
// import { HttpException } from '@athena/shared/exceptions';
// import { RequestWithUser } from '../interface/auth.interface';
// import {
//     responseCF,
//     bodyCF,
// } from '../../../../../libs/commonResponse/commonResponse';
// // eslint-disable-next-line @nx/enforce-module-boundaries
// import { createAbility, AppAbility } from '@athena/shared/common-functions';
// import { ForbiddenError, subject } from '@casl/ability';
// import { RequestHandler } from 'express';


// export const authorizationMiddleware = (
//     action: string,
//     resource: string
// ): RequestHandler => {

//     return (req: RequestWithUser, res, next) => {
//         try {
//             console.log("authorization middleware called:::::::::::")
//             const permissionArray: any[] = [];
//             const a: any = req['user'];
//             console.log("yyyyyy",a["user_roles"]);
//             if (a["user_roles"].length > 0) {
//                 a["user_roles"].forEach((element: any) => {
//                     console.log("1111111111111", typeof element.dataValues?.permissions, element.dataValues?.permissions);
//                     const output = element.dataValues?.permissions;
//                     JSON.parse(output).forEach((ele: any) => {
//                         permissionArray.push(ele);
//                     })
//                 });
//                 const roles = a["user_roles"].map((x: any) => x.name);
//                 const isAdminOrSuperAdmin = roles.some((x) => {
//                     return ['Admin', 'Super Admin'].includes(x);
//                 })

//                 req['isAdminOrSuperAdmin'] = isAdminOrSuperAdmin;
//                 console.log("ssssssssssssssssss", permissionArray);
//                 const userAbility: AppAbility = createAbility(permissionArray);
//                 console.log("zzzzzzzzzzzzzzzzzzzzzz", userAbility, userAbility["M"]);
//                 console.log("ssssssss", userAbility.can(action, resource))
//                 ForbiddenError.setDefaultMessage(error => `You are not allowed to ${error.action} ${error.subjectType}`);
//                 ForbiddenError.from(userAbility).throwUnlessCan(action, subject(resource, {}));
//                 next();
//             }
//             else {
//                 throw new HttpException(401, `You are not allowed to ${action} ${resource}`);
//             }
//         } catch (err) {
//             console.log("jjujuhi", err);
//             const response = responseCF(
//                 bodyCF({
//                     message: err.message,
//                     code: '611',
//                     status: 'error',
//                 })
//             );
//             return res.json(response);
//         }
//     };
// }
