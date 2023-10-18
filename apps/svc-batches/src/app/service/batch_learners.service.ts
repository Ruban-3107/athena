// import DB from "../../../../../libs/shared/database/models/src/index";
// import { CreateBatch_learnersDto } from '@dtos/batch_learners.dto';
// import { HttpException } from '../../../../../libs/shared/exceptions/src/index';
// import { Batch_learners } from '@interfaces/batch_learners.interface';
// import { isEmpty } from '@utils/util';

// class Batch_learnersService {
//   public batch_learners = DB.DBmodels.batch_learners;
//   public batches = DB.DBmodels.batches;
//   public users = DB.DBmodels.users;

//   public async findAllBatch_learners(): Promise<Batch_learners[]> {
//     const allBatch_learners: Batch_learners[] = await this.batch_learners.findAll({ include: ['user', 'batches'] });
//     return allBatch_learners;
//   }

//   public async findBatch_learnerById(batch_learnerId: number): Promise<Batch_learners> {
//     if (isEmpty(batch_learnerId)) throw new HttpException(400, "BatchId is empty");

//     const findbatch_learner: Batch_learners = await this.batch_learners.findByPk(batch_learnerId, { include: ['user', 'batches'] });
//     if (!findbatch_learner) throw new HttpException(409, "Batch_learners doesn't exist");

//     return findbatch_learner;
//   }

//   public async createBatch_learner(batch_learnerData: CreateBatch_learnersDto): Promise<Batch_learners> {
//     if (isEmpty(batch_learnerData)) throw new HttpException(400, "batch_learnerData is empty");

//     // const findbatch_learner: Batch_learners = await this.batch_learners.findOne({ where: { attachment_url: batch_learnerData.user_id } });
//     // if (findbatch_learner) throw new HttpException(409, `This batch_learner already exists`);

//     const createBatch_learnerData: Batch_learners = await this.batch_learners.create({ ...batch_learnerData });
//     return createBatch_learnerData;
//   }

//   public async updateBatch_learner(batch_learnerId: number, batch_learnerData: CreateBatch_learnersDto): Promise<Batch_learners> {
//     if (isEmpty(batch_learnerData)) throw new HttpException(400, "batch_learnerData is empty");

//     const findbatch_learner: Batch_learners = await this.batch_learners.findByPk(batch_learnerId);
//     if (!findbatch_learner) throw new HttpException(409, "Batch_learners doesn't exist");

//     await this.batch_learners.update({ ...batch_learnerData }, { where: { id: batch_learnerId } });

//     const updatedBatch_learner: Batch_learners = await this.batch_learners.findByPk(batch_learnerId);
//     return updatedBatch_learner;
//   }

//   public async deleteBatch_learner(batch_learnerId: number): Promise<Batch_learners> {
//     if (isEmpty(batch_learnerId)) throw new HttpException(400, "Batch_learners doesn't existId");

//     const findbatch_learner: Batch_learners = await this.batch_learners.findByPk(batch_learnerId);
//     if (!findbatch_learner) throw new HttpException(409, "Batch_learners doesn't exist");

//     await this.batch_learners.destroy({ where: { id: batch_learnerId } });

//     return findbatch_learner;
//   }


//   // public async generateSchedule(batchId: number, trackId: number) {
//   //   const utracksData = await this.userTracks.findAll({ where: { batch_id: batchId, track_id: trackId } })
//   //   // const users = utracksData.map((x) => x.user_id)//array of id of users
//   //   const topic_data = utracksData[0].course_summary_data;
//   //   const topicArray = {};
//   //   topic_data.map((x) => {
//   //     if (x.topics.length > 0) {
//   //       x.topics.sort((a, b) => a.position - b.position).map((topic) => topicArray[x.id].push(topic))
//   //     }
//   //     if (x.chapters.length > 0) {
//   //       x.chapters.map((chapter) => {
//   //         chapter.topics.sort((a, b) => a.position - b.position).map((topic) => {
//   //           const topicc = topic;
//   //           topicc["chapter"] = chapter.id;
//   //           topicArray[x.id].push(topicc);
//   //         })
//   //       })
//   //     }
//   //   })
//   //   const moment = require('moment')
//   //   let date = new Date();
//   //   date = moment(date).format('DD/MM/YYYY');
//   //   const time = '09:00';
//   //   let dateTime = new Date(moment(date + ' ' + time, 'DD/MM/YYYY HH:mm'));
//   //   // dateTime.setSeconds(dateTime.getSeconds() + 70);
//   //   // console.log(dateTime)
//   //   for (const key in topicArray) {
//   //     for (const i of topicArray[key]) {
//   //       const endDate = new Date(dateTime.setSeconds(dateTime.getSeconds() + topicArray[key][i].duration))
//   //       if (topicArray[key][i].topic_type == "ILT") {
//   //         if (!topicArray[key][i].same_day) {
//   //           dateTime = new Date(dateTime.setDate(dateTime.getDate() + 1));
//   //           dateTime = new Date(moment(dateTime + ' ' + time, 'DD/MM/YYYY HH:mm'));
//   //         }
          
//   //         for (const k of utracksData) {
//   //           const schedule = {
//   //             learner_id: utracksData[k].user_id,
//   //             batch_id: batchId,
//   //             course_id:key,
//   //             chapter_id: topicArray[key][i].chapter??null,
//   //             topic_id: topicArray[key][i].id,
//   //             user_track_id: utracksData[k].id,
//   //             start_time: dateTime,
//   //             end_time: endDate,
//   //             status:"pending"
//   //           }
//   //         }
//   //       }
//   //       dateTime = endDate;       
//   //     }

//   //   }
//   // }
// }

// export default Batch_learnersService;
