// import { NextFunction, Request, Response } from 'express';
// import { CreateBatch_learnersDto } from '@dtos/batch_learners.dto';
// import { Batch_learners } from '@interfaces/batch_learners.interface';
// import Batch_learnersService from '@services/batch_learners.service';

// class Batch_learnersController {
//   public Batch_learnersService = new Batch_learnersService();

//   public getBatch_learners = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const findAllBatch_learnersData: Batch_learners[] = await this.Batch_learnersService.findAllBatch_learners();

//       //res.status(200).json({ data: findAllBatch_learnersData, message: 'findAll' });
//       return findAllBatch_learnersData;
//     } catch (error) {
//       next(error);
//     }
//   };

//   public getBatch_learnerById = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const batch_learnerId = Number(req.params.id);
//       const findOneBatch_learnerData: Batch_learners = await this.Batch_learnersService.findBatch_learnerById(batch_learnerId);

//       // res.status(200).json({ data: findOneBatch_learnerData, message: 'findOne' });
//       return findOneBatch_learnerData;
//     } catch (error) {
//       next(error);
//     }
//   };

//   public createBatch_learner = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const certificationData: CreateBatch_learnersDto = req.body;
//       const createCertificationData: Batch_learners = await this.Batch_learnersService.createBatch_learner(certificationData);

//       //res.status(201).json({ data: createCertificationData, message: 'created' });
//       return createCertificationData;
//     } catch (error) {
//       next(error);
//     }
//   };

//   public updateBatch_learner = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const batch_learnerId = Number(req.params.id);
//       const certificationData: CreateBatch_learnersDto = req.body;
//       const updateCertificationData: Batch_learners = await this.Batch_learnersService.updateBatch_learner(batch_learnerId, certificationData);

//       //res.status(200).json({ data: updateCertificationData, message: 'updated' });
//       return updateCertificationData;
//     } catch (error) {
//       next(error);
//     }
//   };

//   public deleteBatch_learner = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const batch_learnerId = Number(req.params.id);
//       const deleteCertificationData: Batch_learners = await this.Batch_learnersService.deleteBatch_learner(batch_learnerId);

//       //res.status(200).json({ data: deleteCertificationData, message: 'deleted' });
//       return deleteCertificationData;
//     } catch (error) {
//       next(error);
//     }
//   };
// }

// export default Batch_learnersController;
