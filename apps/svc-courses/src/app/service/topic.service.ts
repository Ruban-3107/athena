import DB from '../database/index';
import { CreateTopicDto } from '../dto/topics.dto';
import { HttpException } from '@athena/shared/exceptions';
import { Topic } from '../interface/topic.interface';
import { getPagingData, isEmpty } from '@athena/shared/common-functions';
import { Op } from 'sequelize';
import { User } from '../interface/auth.interface';
import { convertToPDF, uploadTopic,getcallfroms3 } from '@athena/shared/file-upload';
import { getTransaction } from '../../../../../libs/commonFunctions/cf';
import { apiRequestHandlerWithTransaction } from '@athena/shared/common-functions';
import { PATHS, USERS_SERVICE_PORT, USERS_SERVICE_URL } from '../config/index';

class TopicService {
  public topics = DB.DBmodels.topics;

  public async searchTopics(req): Promise<Topic[]> {
    try {
      const {
        topicType,
        deliveryType,
        // topicName,
        // createdBy,
        status,
        searchkey = '',
        pageNo = 1,
        size = 10,
      } = req;
      const keyword = searchkey;

      const totalUsers = await this.topics.count({
        where: {
          deleted_at: null,
        },
      });

      //const { limit, offset } = getPagination(pageNo, size, totalUsers);

      const obj = {};
      if (topicType !== "all") {
        obj['topic_type'] = topicType;
      }
      if (deliveryType !== "all") {
        obj['delivery_type'] = deliveryType;
      }
      // if (createdBy) {
      //   obj['createdBy'] = createdBy;
      // }
      if (status !== "all") {
        obj['status'] = status;
      }

      const limit = size;
      const offset = (pageNo - 1) * limit;
      if (keyword) {
        console.log('i came here', keyword,obj);
        const response: any = await this.topics
          .findAndCountAll({
            where: {
              [Op.and]: [
                obj,
              {[Op.or]: [
                // { topic_type: { [Op.iLike]: `%${keyword}%` } },
                { title: { [Op.iLike]: `%${keyword}%` } },
                // { delivery_type: { [Op.iLike]: `%${keyword}%` } },
                // { duration: { [Op.iLike]: `%${keyword}%` } },
                // { created_by: { [Op.iLike]: `%${keyword}%` } },
              ],}]
            },
            limit,
            offset,
            distinct: true,
            logging:console.log
          })
          .then((result) => {
            return result;
          });
        const foundTopics: any = getPagingData(
          response,
          pageNo,
          limit,
          response.count
        );
        return foundTopics;
      } else {
        console.log('no search key');
        throw new HttpException(400, 'No searchkey found');
      }
    } catch (error) {
      throw new HttpException(400, `${error}`);
    }
  }
  /**NEW: pagination with sort and filter options*/
  public async filterTopics(req: any): Promise<Topic[]> {
    try {
      console.log(req, '---oooostatus0000---');

      const defaultFilterParams = {
        type: 'all',
        // nameFilter: 'DESC',
        // emailFilter: 'DESC',
        technology_skills: 'all',
        deliveryType: 'all',
        topicType: 'all',
        createdBy: 'all',
        status: 'all',
        pageNo: 1,
        size: 10,
        roles: 'all',
        clients: 'all',
      };

      // Merge defaults to the req param
      req = { ...defaultFilterParams, ...req };

      // Setting a type for the where object
      type FilterObject = {
        delivery_type?: any;
        topic_type?: any;
        status?: any;
        deleted_at?: any;
        technology_skills?: any;
      };

      // Empty object in which we can manipulate the where attributes
      const where: FilterObject = {};

      if (req.topicType !== 'all') {
        where.topic_type = req.topicType;
      }
      if (req.deliveryType !== 'all') {
        console.log('-[e[w[ew[ew-');

        where.delivery_type = req.deliveryType;
      }
      if (req.technology_skills !== 'all') {
        console.log('-[e[w[ew[ew-');

        where.technology_skills = req.technology_skills;
      }

      if (req.status !== 'all') {
        where.status = req.status;
        console.log('-[e[w[ew[ew-', req.status);
      }
      if (req.technology_skills !== 'all') {
        where['technology_skills'] = req.technology_skills;
      }

      where.deleted_at = null;
      // if (
      //   req.status === 'All' ||
      //   req.status === 'Published' ||
      //   req.status === 'Pending Approval' ||
      //   req.status === 'In Draft'
      // ) {
      console.log(where, '====where');

      const totalTopics = await this.topics.count({ where: where });
      console.log('fffffffffff', totalTopics, req.pageNo, req.size);
      // : { users_type: req.type,    deleted_at: null }
      // Setting page size and page no
      // const { limit, offset } = getPagination(
      //   req.pageNo,
      //   req.size,
      //   totalTopics
      // );

      const limit = req.size;
      const offset = (req.pageNo - 1) * limit;

      console.log('fffffffffff', limit, offset);

      // Condition for roles
      // let userRoles: any;

      // if (Array.isArray(req.roles) && req.roles.length > 0) {
      //   userRoles = { [Op.or]: [] };
      //   req.roles.forEach((role: any) => {
      //     userRoles[Op.or].push({ id: role });
      //   });
      // }

      // let userClients: any;
      // if (Array.isArray(req.clients) && req.clients.length > 0) {
      //   userClients = { [Op.or]: [] };
      //   req.clients.forEach((client) => {
      //     userClients[Op.or].push({ id: client });
      //   });
      // }

      //Can sort with either first_name or email////
      // const order = [];
      // if (req.emailFilter) {
      //   order.push([`email`, `${req.emailFilter}`]);
      // } else if (req.nameFilter) {
      //   order.push([`first_name`, `${req.nameFilter}`]);
      // }

      // if (req.nameFilter !== 'DESC') {
      //   order.push([`first_name`, `${req.nameFilter}`])
      // }
      // if (req.emailFilter !== 'DESC') {
      //   order.push([`email`, `${req.emailFilter}`])
      // }else{
      //   order.push([`email`, `DESC`])
      // }

      // if(req.nameFilter){
      //   order.push([`first_name`, `${req.nameFilter}`])
      // }else if(req.emailFilter){
      //   order.push([`email`, `${req.emailFilter}`])

      // }

      console.log('where', where, limit, offset);
      const response: any = await this.topics.findAndCountAll({
        where: where,
        // order,
        limit,
        offset,
        distinct: true,
        // include: [
        //   {
        //     model: this.roles,
        //     as: 'user_roles',
        //     where: userRoles,
        //   },
        //   {
        //     model: this.userProfiles,
        //     as: 'user_profiles',
        //   },
        //   {
        //     model: this.clients,
        //     as: 'client',
        //     where: userClients,
        //   },
        // ],
      });

      // console.log('Response query:', response);

      // Get the required data in proper format
      const allUser: any = getPagingData(
        response,
        req.pageNo,
        limit,
        response.count
      );

      return allUser;
      // } else {
      //   throw new HttpException(400, 'Status not found');
      // }
    } catch (error) {
      throw new HttpException(400, `${error}`);
    }
  }

  public async findAllTopic(): Promise<Topic[]> {
    try {
      const allTopic: Topic[] = await this.topics.findAll({
        // include: ['topic_additional_resources', 'createdUser', 'approvedUser'],
        order: [['id', 'ASC']],
      });
      return allTopic;
    } catch (error) {
      throw new HttpException(400, `${error}`);
    }
  }

  public async findTopicById(topicId: number, token: string): Promise<Topic> {
    try {
      if (isEmpty(topicId)) throw new HttpException(400, 'TopicId is empty');

      const findTopic: Topic = await this.topics.findOne({
        where: { id: topicId },
        // include: ['topic_additional_resources', 'createdUser', 'approvedUser'],
      });
      if (!findTopic) throw new HttpException(404, "Topic doesn't exist");
      const item = {
        users: [
          { createdUser: findTopic.created_by },
          { approvedUser: findTopic.approved_by },
        ],
      };
      const userData = await apiRequestHandlerWithTransaction(
        `${USERS_SERVICE_URL}:${USERS_SERVICE_PORT}/${PATHS.GETUSERS}`,
        token,
        'POST',
        item,
        false
        // t
      );
      if (userData?.status === 'success') {
        findTopic['dataValues']['createdUser'] = userData?.value?.createdUser;
        findTopic['dataValues']['approvedUser'] = userData?.value?.approvedUser;
      }
      return findTopic;
    } catch (error) {
      throw new HttpException(400, `${error}`);
    }
  }

  public async findTopicByStatus(topicStatus: string): Promise<Topic[]> {
    try {
      if (isEmpty(topicStatus))
        throw new HttpException(400, 'TopicId is empty');

      const findTopic: Topic[] = await this.topics.findAll({
        where: { status: topicStatus },
        // include: 'topic_additional_resources',
      });
      if (!findTopic) throw new HttpException(404, "Topic doesn't exist");
      return findTopic;
    } catch (error) {
      throw new HttpException(400, `${error}`);
    }
  }

  public async createTopiclink(
    topicData: CreateTopicDto,
    role: any,
    userDataFromToken: User,
    approvedBy: number|null
  ): Promise<Topic> {
    try {
      console.log(
        'in service',
        role,
        role === 'Super Admin' || role === 'Admin'
      );
      if (isEmpty(topicData))
        throw new HttpException(400, 'topicData is empty');
      // const filekey = topicData.s3_bucket_filekey;
      // if (role === 'Super Admin' || role === 'Admin') {
      //   const pdfurl = await convertToPDF(filekey);
      //   topicData.s3_bucket_pdf_filekey = `${topicData.title}${pdfurl}`;
      // }
      const now = new Date();
      const timestamp = new Date().getTime().toString();
      const random = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');
      const uniqueId = `TOP_${timestamp}_${random}`;

      const createdby = userDataFromToken.id;
      topicData.created_by = String(createdby);
      if (role === 'Admin' || role === 'Job Architect' || role === 'Super Admin') {
        topicData.approved_by = approvedBy;
        topicData.approved_at = now;
      }
      console.log("popopopopo", role, topicData);
      const createTopicData: Topic = await this.topics.create({
        ...topicData,
        version: '1',
        unique_topic_id: uniqueId,
        is_edited: false,
      });

      const fetchTopic: Topic = await this.topics.findOne({
        where: { id: createTopicData.id },
        // include: 'createdUser',
      });
      return fetchTopic;
    } catch (error) {
      console.log('ddddddddd', error);
      throw new HttpException(400, `${error}`);
    }
  }

  public async createTopicThroughTransaction(
    topicData: CreateTopicDto
  ): Promise<Topic> {
    try {
      const transaction = getTransaction();
      //getting the transaction object from common function where we set the transaction object through calling settransaction in parent endpoint
      if (isEmpty(topicData))
        throw new HttpException(400, 'topicData is empty');

      const timestamp = new Date().getTime().toString();
      const random = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');
      const uniqueId = `TOP_${timestamp}_${random}`;

      try {
        // topicData.technology_skills = Number(topicData.technology_skills);
        console.log('ffffffffffff', topicData);
        const createTopicData: Topic = await this.topics.create(
          {
            ...topicData,
            version: '1',
            unique_topic_id: uniqueId,
            is_edited: false,
          },
          { transaction: transaction }
        );

        const fetchTopic: Topic = await this.topics.findOne({
          where: { id: createTopicData.id },
          // include: 'createdUser',
          transaction: transaction,
        });

        return fetchTopic;
      } catch (error) {
        console.log('rrrrrrrrrrr', error);
        throw new HttpException(400, `${error}`);
      }
    } catch (error) {
      throw new HttpException(400, `${error}`);
    }
  }

  public async publishTopic(
    topicId: number,
    approvedBy: number
  ): Promise<Topic[]> {
    try {
      console.log('topiIddd datta while publishing topicsss:::::::', topicId);

      if (isEmpty(topicId)) throw new HttpException(400, 'TopicId is empty');
      const findTopic: Topic = await this.topics.findOne({
        where: { id: topicId },
      });
      console.log(findTopic, '----hopic');
      const now = new Date();
      if (!findTopic) throw new HttpException(404, "Topic doesn't exist");
      const findTopicIsPublished: Topic = await this.topics.findOne({
        where: { id: topicId, status: 'Published' },
      });
      if (findTopicIsPublished)
        throw new HttpException(404, 'Topic already published');
      const currentVersion = parseInt(findTopic.version, 10);
      const newVersion = (currentVersion + 1).toString();
      await this.topics.update(
        {
          status: 'Published',
          approved_by: approvedBy,
          approved_at: now,
          updated_by: approvedBy,
        },
        { individualHooks: true, where: { id: topicId } }
      );
      const updateTopic: Topic[] = await this.topics.findAll({
        where: { id: topicId },
        // include: ['createdUser', 'approvedUser'],
      });
      return updateTopic;
      // const fetchTopic: Topic = await this.topics.findOne({where: {id: updateResult.id},include:'user'})
      // console.log(fetchTopic,'---fetch Topic----');
      // return fetchTopic;
    } catch (error) {
      throw new HttpException(400, `${error}`);
    }
  }

  public async updateTopicStatus(
    topicId: number,
    userDataFromToken: User
  ): Promise<Topic[]> {
    try {
      console.log('entereddddd in serviceeeee', topicId);
      if (isEmpty(topicId)) throw new HttpException(400, 'topicData is empty');

      const findTopic: Topic = await this.topics.findOne({
        where: { id: topicId },
      });
      let PdfFileKey;
      if (!findTopic) throw new HttpException(404, "Topic doesn't exist");
      if (findTopic.status !== 'Published' && findTopic.delivery_type !== 'Video') {
        console.log('serviceessssssss if condtion');
        const topicuser = findTopic.s3_bucket_filekey;
        console.log('topicuserrrrrrurllllll', topicuser);
        const fetchPdfkey = await convertToPDF(topicuser);
        PdfFileKey = `${findTopic.title}${fetchPdfkey}`;
      }
      console.log('topicdatatatata in topic serviceeee', topicId);

      await this.topics.update(
        {
          status: 'Published',
          approved_by: userDataFromToken.id,
          s3_bucket_pdf_filekey: PdfFileKey ?  PdfFileKey : null,
        },
        { where: { id: topicId } }
      );

      const topicdata: Topic[] = await this.topics.findAll({
        where: { id: topicId },
      });

      return topicdata;
    } catch (err) {
      console.log('iiiiiiiii', err);
      throw new HttpException(404, 'Topic status not updated');
    }
  }

  public async updateTopic(
    topicId: number,
    topicData: CreateTopicDto,
    token: string
  ): Promise<Topic> {
    try {
      if (isEmpty(topicData))
        throw new HttpException(400, 'topicData is empty');

      const findTopic: Topic = await this.topics.findByPk(topicId);
      if (!findTopic) throw new HttpException(404, "Topic doesn't exist");
      const createdUser = findTopic.created_by;
      // console.log(findTopic.unique_topic_id, '-----fund-----');

      let updateTopic;
      if (
        findTopic.status === 'Pending Approval' ||
        findTopic.status === 'In Draft'
      ) {
        updateTopic = await this.topics.update(
          { ...topicData },
          { where: { id: topicId } }
        );
      } else {
        const findTopicIsEdited: Topic = await this.topics.findOne({
          where: {
            id: findTopic.id,
            unique_topic_id: findTopic.unique_topic_id,
            is_edited: true,
          },
        });

        const findTopicToBeEdited: Topic = await this.topics.findOne({
          where: {
            unique_topic_id: findTopic.unique_topic_id,
            is_edited: false,
          },
        });

        if (findTopicIsEdited) {
          throw new HttpException(
            400,
            `This Topic-${topicId} is already edited. Topic that can be edited is ${findTopicToBeEdited.id}`
          );
        }

        // Gets the current version number and increment it
        const currentVersion = parseInt(findTopic.version, 10);
        const newVersion = (currentVersion + 1).toString();

        const updateTopic: Topic = await this.topics.create({
          ...topicData,
          created_by: createdUser,
          version: newVersion,
          unique_topic_id: findTopic.unique_topic_id,
          is_edited: false,
        });

        try {
          if (updateTopic) {
            await this.topics.update(
              { is_edited: true },
              { individualHooks: true, where: { id: findTopicToBeEdited.id } }
            );
          }
        } catch (error) {
          console.log(error, 'error in updating the topic');
          throw new HttpException(400, `${error}`);
        }
      }

      const fetchTopic: Topic = await this.topics.findOne({
        where: { id: topicId },
        // include: ['createdUser', 'updatedUser'],
      });
      const item = {
        users: [
          { createdUser: fetchTopic.created_by },
          { updatedUser: fetchTopic.updated_by },
        ],
      };
      const userData = await apiRequestHandlerWithTransaction(
        `${USERS_SERVICE_URL}:${USERS_SERVICE_PORT}/${PATHS.GETUSERS}`,
        token,
        'POST',
        item,
        false
        // t
      );
      if (userData?.status === 'success') {
        fetchTopic['dataValues']['createdUser'] = userData?.value?.createdUser;
        fetchTopic['dataValues']['updatedUser'] = userData?.value?.updatedUser;
      }
      return fetchTopic;
    } catch (error) {
      console.log(error, 'catch error');
      throw new HttpException(400, `${error}`);
    }
  }

  public async updateStatus(topicId: number, topicData: any): Promise<Topic> {
    if (isEmpty(topicId)) throw new HttpException(400, 'TopicId is empty');
    const findTopic: Topic = await this.topics.findOne({
      where: { id: topicId },
    });
    if (findTopic === null) throw new HttpException(404, 'Topic Not Found');
    console.log('inserviceeeee', topicId, topicData, findTopic);

    const updateResult: any = await this.topics.update(topicData, {
      where: { id: topicId },
    });
    console.log('uuuuuuuuu', updateResult);
    return updateResult;
  }

  public async deleteTopic(topicId: number, deletedBy: string): Promise<Topic> {
    try {
      if (isEmpty(topicId)) throw new HttpException(400, 'No TopicId');
      const findTopic: Topic = await this.topics.findByPk(topicId);
      if (findTopic === null)
        throw new HttpException(404, "Topic doesn't exist");

      const now = new Date();
      const updateResult = await this.topics.update(
        {
          deleted_by: deletedBy,
          deleted_at: now,
        },
        {
          individualHooks: true,
          where: { id: topicId },
          returning: true,
        }
      );
      return updateResult[1][0];
    } catch (error) {
      throw new HttpException(400, `${error}`);
    }
  }

  //   public async publishTopics(topicId: number): Promise<Topic> {
  //     if (isEmpty(topicId)) throw new HttpException(400, 'TopicId is empty');
  //     console.log(topicId, '---gopic----');

  //     const findTopic: Topic = await this.topics.findOne({
  //       where: { id: topicId },
  //     });
  //     console.log(findTopic, '----hopic');

  //     if (findTopic === null) throw new HttpException(404, 'Topic Not Found');
  //     const updateResult: any = await this.topics.update(
  //       { status: 'Published' },
  //       { where: { id: topicId } }
  //     );
  //     console.log(updateResult, '===updatre res');

  //     return updateResult;
  //   }

  public async topicsBulkUpload(
    topicsData: CreateTopicDto[],
    files: any
  ): Promise<Topic[]> {
    try {
      if (isEmpty(topicsData))
        throw new HttpException(400, 'Topics Data is empty');

      // console.log("in service>>>>>>", data)

      const topicsDataWithAttachmentUrl: any = topicsData.map(
        async (topicData) => {
          const data = await uploadTopic(files);
          if (data.success) {
            topicData.attachment_url = data.url;
          }
          return topicData;
        }
      );
      //if (data.success) topicsData.attachment_url = data.url;

      const topicsBulkUploadData: Topic[] = await this.topics.bulkCreate(
        topicsDataWithAttachmentUrl
      );

      return topicsBulkUploadData;
    } catch (error) {
      throw new HttpException(404, error.message);
    }
  }

  public async verifyTopic(title: any): Promise<Topic> {
    try {
      const findTopic: Topic = await this.topics.findOne({
        where: { title: title },
      });
      console.log(findTopic, '----hopic');
      if (findTopic) throw new HttpException(404, 'Topic already exist');
      return null;
    } catch (error) {
      throw new HttpException(404, error.message);
    }
  }

  public async convertFileToLinkS3(fileName: string): Promise<any> {
    try {
      const getUrl = await getcallfroms3(fileName)
      console.log(getUrl, 'got topics');
      return getUrl
    } catch (error) {
      throw new HttpException(404, error.message);
    }
  }
}

export default TopicService;
