// import { NextFunction, Request, Response } from 'express';
// import { CreateEmploymentHistoryDto } from '../dto/employment_history.dto';
// import { EmploymentHistory } from '../interface/employment_history.interface';
// import employmentHistoryService from '../service/employment_history.service';
// import {
//   responseCF,
//   bodyCF,
// } from '../../../../../libs/commonResponse/commonResponse';
// class EmploymentHistoryController {
//   public employmentHistoryService = new employmentHistoryService();

//   public getEmploymentHistory = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       const findAllEmploymentHistoryData: EmploymentHistory[] =
//         await this.employmentHistoryService.findAllEmploymentHistory();
//       const response = responseCF(
//         bodyCF({
//           val:findAllEmploymentHistoryData,
//           code: '600',
//           status: 'success',
//         })
//       );

//       return res.json(response);
//     } catch (error) {
//       const response = responseCF(
//         bodyCF({
//           val: error,
//           code: '611',
//           status: 'error',
//         })
//       );

//       return res.json(response);
//     }
//   };

//   public getEmploymentHistoryById = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       const employmentHistoryId = Number(req.params.id);
//       const findOneEmploymentHistoryData: EmploymentHistory =
//         await this.employmentHistoryService.findEmploymentHistoryById(
//           employmentHistoryId
//         );
//         const response = responseCF(
//           bodyCF({
//             val: findOneEmploymentHistoryData,
//             code: '600',
//             status: 'success',
//           })
//         );
//         return res.json(response);
//     } catch (error) {
//       const response = responseCF(
//         bodyCF({
//           val: error,
//           code: '611',
//           status: 'error',
//         })
//       );
//       return res.json(response);
//     }
//   };

//   public createEmploymentHistory = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       const employmentHistoryData: CreateEmploymentHistoryDto = req.body;
//       const createEmploymentHistoryData: EmploymentHistory =
//         await this.employmentHistoryService.createEmploymentHistory(
//           employmentHistoryData
//         );
//         const response = responseCF(
//           bodyCF({
//             val: createEmploymentHistoryData,
//             code: '600',
//             status: 'success',
//           })
//         );
//         return res.json(response);
//     } catch (error) {
//       const response = responseCF(
//         bodyCF({
//           val: error,
//           code: '611',
//           status: 'error',
//         })
//       );
//       return res.json(response);
//     }
//   };

//   public updateEmploymentHistory = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       const employmentHistoryId = Number(req.params.id);
//       const employmentHistoryData: CreateEmploymentHistoryDto = req.body;
//       const updateEmploymentHistoryData: EmploymentHistory =
//         await this.employmentHistoryService.updateEmploymentHistory(
//           employmentHistoryId,
//           employmentHistoryData
//         );
//         const response = responseCF(
//           bodyCF({
//             val: updateEmploymentHistoryData,
//             code: '600',
//             status: 'success',
//           })
//         );
//         return res.json(response);
//     } catch (error) {
//       const response = responseCF(
//         bodyCF({
//           val: error,
//           code: '611',
//           status: 'error',
//         })
//       );
//       return res.json(response);
//     }
//   };

//   public deleteEmploymentHistory = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       const employmentHistoryId = Number(req.params.id);
//       const deleteEmploymentHistoryData: EmploymentHistory =
//         await this.employmentHistoryService.deleteEmploymentHistory(
//           employmentHistoryId
//         );
//         const response = responseCF(
//           bodyCF({
//             val: deleteEmploymentHistoryData,
//             code: '600',
//             status: 'success',
//           })
//         );
//         return res.json(response);
//     } catch (error) {
//       const response = responseCF(
//         bodyCF({
//           val: error,
//           code: '611',
//           status: 'error',
//         })
//       );
//       return res.json(response);
//     }
//   };
// }

// export default EmploymentHistoryController;
