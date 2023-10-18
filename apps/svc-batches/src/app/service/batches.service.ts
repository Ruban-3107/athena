import DB from '../database/index';
import { CreateBatchesDto, updateBatchStatusDto } from '../dto/batches.dto';
import { HttpException } from '@athena/shared/exceptions';
import { Batches } from '../interface/batches.interface';
import { Op } from 'sequelize';
import {
  getPagination,
  getPagingData,
  isEmpty,
  apiRequestHandler,
} from '@athena/shared/common-functions';
import {
  COURSES_SERVICE_URL,
  COURSES_SERVICE_PORT,
  GET_TRACKS_ROUTE,
  USERS_SERVICE_PORT,
  GET_USERS_ROUTE,
  USERS_SERVICE_URL,
  PATHS
} from '../config/index';
import { apiRequestHandlerWithTransaction } from '@athena/shared/common-functions';
import { Sequelize } from 'sequelize';

class BatchesService {
  public batches = DB.DBmodels.batches;
  public userTracks = DB.DBmodels.user_tracks;
  public schedules = DB.DBmodels.schedules;
  public batchLearners = DB.DBmodels.batch_learners;

  public async findAllBatches(req: any, token: string): Promise<Batches[]> {
    const defaultFilterParams = {
      pageNo: 0,
      size: 10,
      status: 'all',
    };

    // Merge defaults to the req param
    req = { ...defaultFilterParams, ...req };
    const where: any = {};
    if (req.status !== 'all') {
      where['status'] = req.status;
    }
    const totalTopics = await this.batches.count();
    // console.log('fffffffffff', totalTopics, req.pageNo, req.size);
    // Setting page size and page no
    const { limit, offset } = getPagination(req.pageNo, req.size, totalTopics);
    // console.log('fffffffffff', limit, offset ? offset : 0);

    const response: any = await this.batches.findAndCountAll({
      limit,
      offset,
      distinct: true,
      // include: 'client', //client is in user service need to get client and include
      where: where,
    });
    
    const clientIdArray = [];
    response.rows.forEach((row) => {
      clientIdArray.push({ client: row.client_id })
    })
    const item = {
      clients: clientIdArray
    };
    const userData = await apiRequestHandlerWithTransaction(
      `${USERS_SERVICE_URL}:${USERS_SERVICE_PORT}/${PATHS.GETCLIENTS}`,
      token,
      'POST',
      item,
      false
      // t
    );
    if (userData?.status === 'success') {
      for (const i of response.rows) {
        Object.entries(userData?.value).find(([key, value]) => {
          if (Number(i['dataValues']['client_id']) === Number(key)) {
            i['dataValues']['client'] = value;
          }
        })
        
      }
    }
    const allUser: any = getPagingData(
      response,
      req.pageNo,
      limit,
      response.count
    );
    return allUser;
  }

  public async findAllBatchesWithoutPagination(
    dateRangeType
  ): Promise<Batches[]> {
    const end_date = new Date();
    let start_date = null;
    let where;
    if (
      dateRangeType === 'Month' ||
      dateRangeType === 'Week' ||
      dateRangeType === 'Day'
    ) {
      if (dateRangeType === 'Month') {
        start_date = new Date(end_date.getFullYear(), end_date.getMonth(), 1);
      } else if (dateRangeType === 'Week') {
        start_date = new Date(
          end_date.getFullYear(),
          end_date.getMonth(),
          end_date.getDate() - end_date.getDay()
        );
      } else if (dateRangeType === 'Day') {
        start_date = new Date(
          end_date.getFullYear(),
          end_date.getMonth(),
          end_date.getDate()
        );
      }
      where = { created_at: { [Op.between]: [start_date, end_date] } };
    } else {
      where = {};
    }
    const response: any = await this.batches.findAll({ where: where });
    return response;
  }

  public async findBatchesById(
    batchesId: number,
    token: any
  ): Promise<Batches> {
    // console.log('???????????????????????????', batchesId);
    const findBatch: any = await this.batches.findOne({
      where: { id: batchesId },
      include: [
        {
          model: this.batchLearners,
          as: 'batchBatchLearners',
          attributes: ['user_id'],
        },
      ],
    });
    const data = findBatch?.batchBatchLearners?.map(
      (learner) => learner.user_id
    );

    const usersResponse = await apiRequestHandler(
      `${USERS_SERVICE_URL}:${USERS_SERVICE_PORT}${GET_USERS_ROUTE}/getNeededUsers/byIds`,
      token,
      'POST',
      { users: data }
    );

    const batchTracks = await this.userTracks.findAll({
      where: {
        batch_id: batchesId,
      },
    });

    const batchUniqueUserTracks = [
      ...new Map(
        batchTracks.map((record) => [
          `${record.dataValues.batch_id}-${record.dataValues.track_id}`,
          record,
        ])
      ).values(),
    ];

    const trackIds = batchUniqueUserTracks.map((x) => x.track_id);
    const tracksResponse = await apiRequestHandler(
      `${COURSES_SERVICE_URL}:${COURSES_SERVICE_PORT}${GET_TRACKS_ROUTE}/getNeededTracks/byIds`,
      token,
      'POST',
      { tracks: trackIds }
    );

    if (!findBatch) throw new HttpException(404, "Batch doesn't exist");
    findBatch['dataValues']['user_tracks'] = batchUniqueUserTracks;
    findBatch['dataValues']['batch_learners'] = usersResponse;
    findBatch['dataValues']['assigned_tracks'] =
      tracksResponse?.value?.tracksData;
    return findBatch;
  }

  public async createBatches(
    batchesData: CreateBatchesDto,
    userDataFromToken: any,
    token: string
  ): Promise<Batches> {
    try {
      if (isEmpty(batchesData))
        throw new HttpException(400, 'Batches Data is empty');
      batchesData.created_by = userDataFromToken.id;
      const createBatchesData = await this.batches.create({ ...batchesData });
      // console.log('zzzzzz', createBatchesData, batchesData.tracks_assigned);
      let batch_learners_array;

      if (batchesData.learners) {
        batch_learners_array = batchesData.learners?.map((learner) => {
          return {
            user_id: learner,
            batch_id: createBatchesData.id,
          };
        });
      }

      await this.batchLearners.bulkCreate(batch_learners_array);
      if (batchesData.tracks_assigned) {
        await this.joinTrack(
          batchesData.learners,
          batchesData.tracks_assigned,
          createBatchesData.id,
          token
        );
      }
      return createBatchesData;
    } catch (error) {
      console.log('ddddddd', error);
      throw error;
    }
  }

  public async updateBatches(
    batchesId: number,
    batchesData: CreateBatchesDto
  ): Promise<Batches> {
    try {
      if (isEmpty(batchesData))
        throw new HttpException(400, 'Batches Data is empty');

      const findBatches: Batches = await this.batches.findByPk(batchesId);
      if (!findBatches) throw new HttpException(404, "Batches doesn't exist");

      await this.batches.update(
        { ...batchesData },
        { where: { id: batchesId } }
      );

      let learnersArray;
      // if (batchesData.client_id) {
      //   const findLearners = await this.learners.findAll({
      //     where: { client_id: batchesData.client_id },
      //   });
      //   learnersArray = findLearners.map((x) => x.id);
      //   console.log('aaaaaaa', learnersArray);
      //   if (learnersArray.length > 0) {
      //     await this.associateLearner(batchesId, learnersArray);
      //   }
      // }
      // if (batchesData.learners) {
      //   await this.associateLearner(batchesId, batchesData.learners);
      // }

      // if (batchesData.tracks_assigned) {
      //   await this.ut.joinTrack(
      //     learnersArray ?? batchesData.learners,
      //     batchesData.tracks_assigned,
      //     batchesId
      //   );
      // }

      const updateBatches: Batches = await this.batches.findByPk(batchesId);
      return updateBatches;
    } catch (error) {
      console.log(error);
    }
  }

  public async updateBatchStatus(
    batchesId: number,
    batchesData: updateBatchStatusDto
  ): Promise<Batches> {
    if (isEmpty(batchesData))
      throw new HttpException(400, 'Batches Data is empty');

    const findBatches: Batches = await this.batches.findByPk(batchesId);
    if (!findBatches) throw new HttpException(404, "Batches doesn't exist");

    await this.batches.update({ ...batchesData }, { where: { id: batchesId } });
    const updateBatches: Batches = await this.batches.findByPk(batchesId);
    return updateBatches;
  }

  public async deleteBatches(batchesId: number): Promise<Batches> {
    if (isEmpty(batchesId))
      throw new HttpException(400, "Batches doesn't existId");

    const findBatches: Batches = await this.batches.findByPk(batchesId);
    if (!findBatches) throw new HttpException(404, "Batches doesn't exist");

    await this.batches.destroy({ where: { id: batchesId } });

    return findBatches;
  }

  public async deleteBatch(
    batchesId: number,
    deletedBy: string
  ): Promise<Batches> {
    try {
      if (isEmpty(batchesId)) throw new HttpException(400, 'No batchesId');
      const findBatch: Batches = await this.batches.findByPk(batchesId);
      if (findBatch === null)
        throw new HttpException(404, "Topic doesn't exist");

      const now = new Date();
      const updateResult = await this.batches.update(
        {
          deleted_by: deletedBy,
          deleted_at: now,
        },
        {
          where: { id: batchesId },
          returning: true,
        }
      );
      return updateResult[1][0];
    } catch (error) {
      throw new HttpException(400, `${error}`);
    }
  }

  public async joinTrack(
    users: Array<number>,
    tracksAssign: Array<number>,
    batchId: number | null = null,
    token: string
  ) {
    try {
      let summary_data, course_summary_data;
      const data = { tracks: tracksAssign };
      //     api request for getting tracks
      const tracksResponse = await apiRequestHandler(
        `${COURSES_SERVICE_URL}:${COURSES_SERVICE_PORT}${GET_TRACKS_ROUTE}/getNeededTracks/byIds`,
        token,
        'POST',
        data
      );
      const trackDetail = tracksResponse?.value?.tracksData;
      console.log('users.length::::::::', users.length, trackDetail.length);
      for (let i = 0; i < users.length; i++) {
        for (let j = 0; j < trackDetail.length; j++) {
          const [createdUserTrack] = await this.userTracks.findOrCreate({
            where: {
              user_id: users[i],
              track_id: trackDetail[j].id,
            },
            defaults: {
              summary_data: JSON.stringify({ exercises: {}, concepts: {} }),
              course_summary_data: JSON.stringify({
                children: {},
                chapters: {},
              }),
              last_touched_at: new Date(),
              batch_id: batchId,
            },
          });
          console.log('utra', createdUserTrack);
          console.log('after user track find or create', new Date());

          // summary_data = await this.generateSummaryData(createdUserTrack, tracksAssign[j]);
          course_summary_data = await this.generateCourseSummaryData(
            createdUserTrack,
            trackDetail[j]
          );

          createdUserTrack.course_summary_data =
            JSON.stringify(course_summary_data);
          await createdUserTrack.save();

          // return summary_data;
        }
      }
      return { summary_data, course_summary_data };
    } catch (error) {
      console.log('jointrackerror', error);
      throw new HttpException(500, error.message);
    }
  }

  public async generateCourseSummaryData(userTrack, trackData) {
    try {
      // console.log("ccccccc", Array.isArray(trackData.track_chapters), trackData.track_chapters);
      // console.log("ddddd", Array.isArray(trackData.track_chapters.course_topics), trackData.track_chapters.course_topics);
      const courseSummaryData = {
        // return {
        id: trackData.id,
        slug: trackData.slug,
        status: 'pending',
        completed_at: null,
        position: trackData.position,
        children:
          trackData.children && trackData.children.length > 0
            ? trackData.children.map((child) => {
                return {
                  id: child.id,
                  slug: child.slug,
                  status: 'pending',
                  completed_at: null,
                  position: child.position,
                  chapters:
                    child.track_chapters && child.track_chapters.length > 0
                      ? child.track_chapters.map((chap) => {
                          return {
                            id: chap.id,
                            slug: chap.slug,
                            status: 'pending',
                            completed_at: null,
                            position: chap.position,
                            topics:
                              chap.chapter_topics &&
                              chap.chapter_topics.length > 0
                                ? chap.chapter_topics.map((topic) => {
                                    return {
                                      id: topic.id,
                                      slug: topic.slug ? topic.slug : ' ',
                                      title: topic.title,
                                      topic_type: topic.topic_type,
                                      position: topic.position,
                                      duration: topic.duration,
                                      status: 'pending',
                                      trainer_id: null,
                                      scheduled_at: null,
                                      completed_at: null,
                                    };
                                  })
                                : [],
                          };
                        })
                      : [],
                };
              })
            : [],
        chapters:
          trackData.track_chapters && trackData.track_chapters.length > 0
            ? trackData.track_chapters.map((chap) => {
                return {
                  id: chap.id,
                  slug: chap.slug,
                  status: 'pending',
                  completed_at: null,
                  position: chap.position,
                  topics:
                    chap.chapter_topics && chap.chapter_topics.length > 0
                      ? chap.chapter_topics.map((topic) => {
                          return {
                            id: topic.id,
                            slug: topic.slug ? topic.slug : ' ',
                            title: topic.title,
                            topic_type: topic.topic_type,
                            position: topic.position,
                            duration: topic.duration,
                            status: 'pending',
                            trainer_id: null,
                            scheduled_at: null,
                            completed_at: null,
                          };
                        })
                      : [],
                };
              })
            : [],
      };
      return courseSummaryData;
    } catch (error) {
      console.log(error);
      throw new HttpException(500, error.message);
    }
  }

  public async searchBatches(req): Promise<Batches[]> {
    const { searchkey, pageNo, size } = req;
    const keyword = searchkey;

    const limit = size;
    const offset = (pageNo - 1) * limit;

    if (keyword) {
      const response: any = await this.batches.findAndCountAll({
        where: {
          [Op.and]: [
            {
              deleted_at: { [Op.eq]: null },
            },
            {
              name: { [Op.iLike]: `%${keyword}%` },
            },
          ],
        },
        limit,
        offset,
        distinct: true,
      });

      const foundTopics: any = getPagingData(
        response,
        pageNo,
        limit,
        response.count
      );
      return foundTopics;
    } else {
      console.log('nooo search key');
    }
  }
  /**NEW: pagination with sort and filter options*/
}
export default BatchesService;
