import DB from '../database/index';
import { CreateChapterDto } from '../dto/chapters.dto';
import { HttpException } from '@athena/shared/exceptions';
import { Chapter } from '../interface/chapters.interface';
import { getPagingData, isEmpty } from '@athena/shared/common-functions';
import { Op, Transaction } from 'sequelize';
import { User } from '../interface/routes.interface';
import { apiRequestHandlerWithTransaction } from '@athena/shared/common-functions';
import {
  COURSES_SERVICE_PORT,
  PATHS,
  COURSES_SERVICE_URL,
} from '../config/index';
import {
  getTransaction,
  setTransaction,
} from '@athena/shared/common-functions';
import { convertToPDF } from '@athena/shared/file-upload';

class ChapterService {
  public chapters = DB.DBmodels.chapters;
  public topics = DB.DBmodels.topics;

  public async findAllChapter(): Promise<Chapter[]> {
    const allChapter: Chapter[] = await this.chapters.findAll({
      include: [
        {
          model: this.topics,
          as: 'chapter_topics',
        },
      ],
      order: [['id', 'DESC']],
    });
    return allChapter;
  }

  public async findChapterById(chapterId: number): Promise<Chapter> {
    if (isEmpty(chapterId)) throw new HttpException(400, 'ChapterId is empty');

    const findChapter: Chapter = await this.chapters.findOne({
      where: { id: chapterId },
      include: [
        {
          model: this.topics,
          as: 'chapter_topics',
        },
      ],
    });
    if (!findChapter) throw new HttpException(404, "Chapter doesn't exist");

    return findChapter;
  }

  //     chapterData: CreateChapterDto,
  //     userDataFromToken: User,
  //     token: string,
  //     res: any
  // ): Promise<unknown> {
  //     let result: unknown;
  //     try {
  //         console.log("teteetetet1", res.headersSent);
  //         result = await DB?.sequelize?.transaction(async (t) => {
  //             console.log("ettretretretrer",token);
  //         console.log("teteetetet2", res.headersSent);
  //         const findChapter: Chapter = await this.chapters.findOne({
  //             where: { title: chapterData.title },
  //         });
  //         console.log("3333333333", findChapter);
  //             const data = await this.commonchapter(
  //                 chapterData,
  //                 userDataFromToken,
  //                 token,
  //                 t
  //             );
  //             console.log("teteetetet3", res.headersSent);
  //             return data;
  //             // if (isEmpty(chapterData))
  //             //   throw new HttpException(400, 'chapterData is empty');

  //             // const findChapter: Chapter = await this.chapters.findOne({
  //             //   where: { title: chapterData.title },
  //             // });
  //             // if (findChapter)
  //             //   throw new HttpException(
  //             //     409,
  //             //     `This chapter with ${chapterData.slug} already exists`
  //             //   );
  //             // chapterData['created_by'] = userDataFromToken.id;
  //             // const createChapterData: Chapter = await this.chapters.create({ ...chapterData, }, { transaction: t });

  //             // console.log(
  //             //   'chapdata',
  //             //   chapterData,
  //             //   typeof chapterData.topics,
  //             //   chapterData.topics
  //             // );
  //             // if (chapterData.topics && chapterData.topics.length > 0) {
  //             //   const finaltopicArray = []; //array to hold the topic ids to be associated with the chapter
  //             //   for (const item of chapterData.topics) {
  //             //     console.log('1111111', item);
  //             //     if (Object.keys(item).includes('id')) {
  //             //       //if the object includes id which means it's an already existing topic
  //             //       console.log('yes id', item, item['id']);
  //             //       finaltopicArray.push(item['id']);
  //             //     } else {
  //             //       /**to create a topic,this is the api call instead of calling the service directly */
  //             //       let topicCreateResponse;
  //             //       try {
  //             //         setTransaction(t);
  //             //         topicCreateResponse = await apiRequestHandlerWithTransaction(
  //             //           `http://${HOST_IP}:3001/api/courses/topics/throughchapter`,
  //             //           token,
  //             //           'POST',
  //             //           item, false, t
  //             //         );
  //             //         console.log('createddddddddddddddd', topicCreateResponse);
  //             //       } catch (error) {
  //             //         console.log('ereeererer', error);
  //             //         throw new HttpException(400, 'chapterData is empty');
  //             //       }
  //             //       if (topicCreateResponse?.status === "success") {
  //             //         finaltopicArray.push(topicCreateResponse?.value?.id);
  //             //       }
  //             //       else throw new HttpException(400, 'error in creating topic');
  //             //     }
  //             //   }
  //             //   console.log('sssssssssssss', finaltopicArray);
  //             //   chapterData.topics = finaltopicArray;
  //             //   console.log('dfdfdf', chapterData.topics);
  //             //   // const topicValue = await this.topics.findOne({ where: { id: finaltopicArray[1] }, transaction: t });
  //             //   // console.log('eeeeeee', topicValue);
  //             //   await this.handlePositioning(createChapterData.id, 'create', chapterData.topics,t);
  //             //   await this.associateTopic(createChapterData.id, chapterData.topics,t);
  //             // }
  //             // return createChapterData;
  //         });

  //         // If the execution reaches this line, the transaction has been committed successfully
  //         // `result` is whatever was returned from the transaction callback (the `user`, in this case)

  //         // if (isEmpty(chapterData))
  //         //   throw new HttpException(400, 'chapterData is empty');

  //         // const findChapter: Chapter = await this.chapters.findOne({
  //         //   where: { title: chapterData.title },
  //         // });
  //         // if (findChapter)
  //         //   throw new HttpException(
  //         //     409,
  //         //     `This chapter with ${chapterData.slug} already exists`
  //         //   );
  //         // chapterData['created_by'] = userDataFromToken.id;
  //         // const createChapterData: Chapter = await this.chapters.create({
  //         //   ...chapterData,
  //         // });

  //         // console.log(
  //         //   'chapdata',
  //         //   chapterData,
  //         //   typeof chapterData.topics,
  //         //   chapterData.topics
  //         // );
  //         // if (chapterData.topics && chapterData.topics.length > 0) {
  //         //   const finaltopicArray = []; //array to hold the topic ids to be associated with the chapter
  //         //   for (const item of chapterData.topics) {
  //         //     console.log('1111111', item);
  //         //     if (Object.keys(item).includes('id')) {
  //         //       //if the object includes id which means it's an already existing topic
  //         //       console.log('yes id', item, item['id']);
  //         //       finaltopicArray.push(item['id']);
  //         //     } else {
  //         //       /**to create a topic,this is the api call instead of calling the service directly */
  //         //       let topicCreateResponse;
  //         //       try {
  //         //         topicCreateResponse = await apiRequestHandler(
  //         //           `http://${HOST_IP}:3001/api/courses/topics/throughchapter`,
  //         //           token,
  //         //           'POST',
  //         //           item
  //         //         );
  //         //         console.log('createddddddddddddddd', topicCreateResponse);
  //         //       } catch (error) {
  //         //         console.log('ereeererer', error);
  //         //         throw new HttpException(400, 'chapterData is empty');
  //         //       }
  //         //       finaltopicArray.push(topicCreateResponse?.value?.id);
  //         //     }
  //         //   }
  //         //   console.log('sssssssssssss', finaltopicArray);
  //         //   chapterData.topics = finaltopicArray;
  //         //   console.log('dfdfdf', chapterData.topics);
  //         //   await this.handlePositioning(createChapterData.id, 'create', chapterData.topics);
  //         //   await this.associateTopic(createChapterData.id, chapterData.topics);
  //         // }
  //         // return createChapterData;
  //         // return null;
  //     } catch (error) {
  //         console.log('ggggggggg', error);
  //         throw new HttpException(400, error?.message);
  //     }
  //     return result;
  // }

  // public async createChapter(chapterData: CreateChapterDto,
  //     userDataFromToken: User,
  //     token: string,
  //     res: any): Promise<Chapter> {

  //     try {
  //         console.log("rrrrrrrrrrrr",res.headersSent)
  //         const findChapter: any = await this.chapters.findOne({
  //             where: { title: chapterData.title },
  //         });
  //         console.log("3333333333", res.headersSent, findChapter);
  //         console.log("444444444444");
  //         return findChapter;
  //     } catch (error) {
  //         console.log("rrrrrrrrrr", error);
  //     }
  //     }

  public async createChapter(
    chapterData: CreateChapterDto,
    userDataFromToken: User,
    token: string
  ): Promise<Chapter> {
    let result;
    try {
      console.log('788888888888888888888');
      console.log('84444444444444444');
      result = await DB.sequelize.transaction(async (t) => {
        console.log('8989999999999999999999');
        const data = await this.commonchapter(
          chapterData,
          userDataFromToken,
          token,
          t
        );
        console.log('121212111212');
        return data;
      });
      console.log('rrrrrrrrrrrrr');
      return result;
      // If the execution reaches this line, the transaction has been committed successfully
      // `result` is whatever was returned from the transaction callback (the `user`, in this case)
    } catch (error) {
      console.log('ggggggggg', error);
      throw new HttpException(400, error?.message);
    }
  }

  public async createChapterThroughTrack(
    chapterData: CreateChapterDto,
    userDataFromToken: User,
    token: string
  ): Promise<any> {
    try {
      const t = getTransaction();
      const data = await this.commonchapter(
        chapterData,
        userDataFromToken,
        token,
        t
      );
      return data;
    } catch (error) {
      console.log('ggggggggg', error);
      throw new HttpException(400, error?.message);
    }
  }

  public async  commonchapter(
    chapterData: CreateChapterDto,
    userDataFromToken: any,
    token: string,
    t: Transaction
  ): Promise<Chapter> {
    try {
      console.log('oppopopopopopopo', userDataFromToken);
      if (isEmpty(chapterData))
        throw new HttpException(400, 'chapterData is empty');
      console.log('platform111111111111');
      const findChapter: Chapter = await this.chapters.findOne({
        where: { title: chapterData.title },
      });
      console.log('3333333333', findChapter);
      if (findChapter)
        throw new HttpException(
          409,
          `This chapter with ${chapterData.slug} already exists`
        );
      console.log('4444444444');
      chapterData['created_by'] = Number(userDataFromToken?.id);
      // if (chapterData.approver) {
      //   chapterData['approved_by'] = Number(chapterData.approver) ;
      // }
      // const rolesuser = userDataFromToken?.userRoles?.map((x: { name: any; }) => x.name);
      // console.log("rrrrrrrrrrrrr", rolesuser);
      // const approverTrue = rolesuser.some((x) => {
      //   return ['Super Admin', 'Admin', 'Job Architect'].includes(x);
      // })
      const rolesuser = userDataFromToken?.userRoles[0].name;
      const approverTrue = rolesuser === 'Admin' || rolesuser === 'Job Architect' || rolesuser === 'Super Admin';
      if (approverTrue) {
        chapterData['approved_by'] = Number(userDataFromToken.id);
        chapterData['approved_at'] = new Date();
      }

      console.log('platform2222222222', rolesuser,approverTrue, chapterData);
      const createChapterData: Chapter = await this.chapters.create(
        { ...chapterData },
        { transaction: t }
      );

      // console.log('chapdata',chapterData,typeof chapterData.topics,chapterData.topics);
      if (chapterData.topics && chapterData.topics.length > 0) {
        const finaltopicArray = []; //array to hold the topic ids to be associated with the chapter
        for (const item of chapterData.topics) {
          console.log('1111111', item);
          if (Object.keys(item).includes('id')) {
            //if the object includes id which means it's an already existing topic
            console.log('yes id', item, item['id']);
            finaltopicArray.push(item['id']);
          } else {
            /**to create a topic,this is the api call instead of calling the service directly */
            if (approverTrue) {
              item['approved_by'] = Number(userDataFromToken.id);
              item['approved_at'] = new Date();
            }
            let topicCreateResponse;
            try {
              setTransaction(t);
              topicCreateResponse = await apiRequestHandlerWithTransaction(
                `${COURSES_SERVICE_URL}:${COURSES_SERVICE_PORT}/${PATHS.CHAPTER_TOPIC}`,
                token,
                'POST',
                item,
                false
                // t
              );
              console.log('topiccreateresponseeeee', topicCreateResponse);
            } catch (error) {
              console.log('ereeererer', error);
              throw new HttpException(400, 'chapterData is empty');
            }
            if (topicCreateResponse?.status === 'success') {
              finaltopicArray.push(topicCreateResponse?.value?.id);
            } else throw new HttpException(400, 'error in creating topic');
          }
        }
        console.log('sssssssssssss', finaltopicArray);
        chapterData.topics = finaltopicArray;
        console.log('dfdfdf', chapterData.topics);
        await this.handlePositioning(
          createChapterData.id,
          'create',
          chapterData.topics,
          t
        );
        await this.associateTopic(createChapterData.id, chapterData.topics, t);
        console.log('ggggggggggggg');
      }
      console.log('platform333333333333');
      return createChapterData;
    } catch (error) {
      console.log('ttttttttttttlllllllllllllll', error);
      throw new HttpException(400, `${error}`);
    }
  }
  public async publishChapter(
    chapterId: number,
    approvedBy: number
  ): Promise<Chapter[]> {
    try {
      if (isEmpty(chapterId))
        throw new HttpException(400, 'ChapterId is empty');
      const findChapter: Chapter = await this.chapters.findOne({
        where: { id: chapterId },
      });
      const now = new Date();
      if (!findChapter) throw new HttpException(404, "Chapter doesn't exist");
      const findChapterIsPublished: Chapter = await this.chapters.findOne({
        where: { id: chapterId, status: 'Published' },
      });
      if (findChapterIsPublished)
        throw new HttpException(404, 'Chapter already published');
      // const currentVersion = parseInt(findTopic.version, 10);
      // const newVersion = (currentVersion + 1).toString();
      await this.chapters.update(
        {
          status: 'Published',
          approved_by: approvedBy,
          approved_at: now,
          updated_by: approvedBy,
        },
        { individualHooks: true, where: { id: chapterId } }
      );
      const updateChapter: Chapter[] = await this.chapters.findAll({
        where: { id: chapterId },
        include: ['createdUser', 'approvedUser'],
      });
      return updateChapter;
      // const fetchTopic: Topic = await this.topics.findOne({where: {id: updateResult.id},include:'user'})
      // console.log(fetchTopic,'---fetch Topic----');

      // return fetchTopic;
    } catch (error) {
      throw new HttpException(400, `${error}`);
    }
  }

  public async updateChapterStatus(
    chapterId: number,
    userDataFromToken: User
  ): Promise<Chapter> {

    try {
      // console.log("chapterssssss", chapterData, chapterId);
      if (isEmpty(chapterId))
        throw new HttpException(400, "chapterId doesn't exist");

      const findChapter: Chapter = await this.chapters.findOne({
        where: { id: chapterId },
      });
      if (!findChapter) throw new HttpException(404, "Chapter doesn't exist");

      const now = new Date();

      // console.log("finddddddddddd---------------", findChapter);
      // const findTopic = await this.topics.findOne({ where: { id: topicId } });
      if (findChapter.status !== 'Published') {
        console.log("entered into statuussssssss");
        // if (chapterData.status === 'Published') {
          const chapterTopics = await this.chapters.findOne({
            where: { id: chapterId },
            include: [
              {
                model: this.topics,
                as: 'chapter_topics',
              },
            ],
          });

          const topics = chapterTopics?.dataValues?.chapter_topics?.map((x) => {
            const topicobj = {};
            topicobj['id'] = x?.dataValues?.id;
            topicobj['status'] = x?.dataValues?.status;
            if (x?.dataValues?.s3_bucket_filekey !== null) {
              topicobj['s3_bucket_filekey'] = x?.dataValues?.s3_bucket_filekey;
            }
            return topicobj;
          });
          // let topicslink = topics.dataValues.attachement_url;
          let topicCounter = 0;
          for (const i of topics) {
            // console.log("looooppppppppppppppp", i);
            if (i.status !== 'Published') {
              if (i.s3_bucket_filekey) {
                const topicuser = i.s3_bucket_filekey;
                // const urlToConvert = topicuser;
                const filekey = await convertToPDF(topicuser);
                console.log('PDF uploaded to S3:', filekey);
                i.s3_bucket_pdf_filekey = `${i.title}${filekey}` ;
                const topicid = i.id;
                delete i.id;
                i.status = 'Published';
                i.approved_by = userDataFromToken.id;
                i.approved_at = now;
                await this.topics.update(i, { where: { id: topicid } });
                topicCounter++;
              } else {
                const topicid = i.id;
                delete i.id;
                i.status = 'Published';
                i.approved_by = userDataFromToken.id;
                i.approved_at = now;
                await this.topics.update(i, { where: { id: topicid } });
                topicCounter++;
              }
            } else {
              topicCounter++;
            }
          }

          if (topics.length === topicCounter) {
            await this.chapters.update(
              {
                status: 'Published',
                approved_by: userDataFromToken.id,
                approved_at: now,
              },
              { where: { id: chapterId } }
            );
          }
        const chapterdata: any = await this.chapters.findAll({where: { id: chapterId }});
          return chapterdata;
        // }
      }
      await this.chapters.update(
        { status: 'published',approved_by : userDataFromToken.id, approved_at : now},
        { where: { id: chapterId } }
      );
      const chapterdata:any = await this.chapters.findOne({where: { id: chapterId }});
      return chapterdata;
    } catch (err) {
      console.log('error', err);
    }
  }

  public async updateChapter(
    chapterId: number,
    chapterData: CreateChapterDto
  ): Promise<Chapter> {
    if (isEmpty(chapterData))
      throw new HttpException(400, 'chapterData is empty');

    const findChapter: Chapter = await this.chapters.findByPk(chapterId);
    if (!findChapter) throw new HttpException(404, "Chapter doesn't exist");

    await this.chapters.update(
      { ...chapterData },
      { individualHooks: true, where: { id: chapterId } }
    );
    const data: Chapter = await this.chapters.findByPk(chapterId);
    return data;
  }

  public async updateStatus(chapterId: number, chapterData:any): Promise<Chapter> {
    if (isEmpty(chapterId)) throw new HttpException(400, 'ChapterId is empty');

    const findChapter: Chapter = await this.chapters.findOne({
      where: { id: chapterId },
    });
    if (findChapter === null) throw new HttpException(404, 'Chapter Not Found');
    console.log("chapterrrrdattaaaa", chapterData);
    
    if (findChapter.status !== 'Approved') {
      console.log("vachesindhi mowa status if loki");
      if (chapterData.status === 'Approved') {
        console.log("entered in chapterdata status is published");
        const chapterTopics = await this.chapters.findOne({
          where: { id: chapterId },
          include: [{
            model: this.topics,
            as: 'chapter_topics',
          }]
        })

        let topics = chapterTopics?.dataValues?.chapter_topics?.map((x) => {
          let topicobj = {};
          topicobj["id"] = x?.dataValues?.id;
          topicobj["status"] = x?.dataValues?.status;
          return topicobj;
        });
        let topicCounter = 0;
        for (const i of topics) {
          if (i.status !== "Approved") {
                  const topicid = i.id;
                  delete i.id;
                  i.status = 'Approved';
                  await this.topics.update(i, { where: { id: topicid } });
                  topicCounter++;
          } else {
            topicCounter++;
            const topicId = i.id;
            await this.topics.update( chapterData, { where: { id: topicId } });
          }
        }
        if (topics.length === topicCounter) {
          await this.chapters.update(
            chapterData , { where: { id: chapterId } }
          );
        }
        const chapterdata = await this.chapters.findByPk(chapterId);
        return chapterdata;
      }
    }
    await this.chapters.update(
      chapterData , { where: { id: chapterId } }
    );
    const chapterdata = await this.chapters.findByPk(chapterId);
    return chapterdata;

  } 

  public async deleteChapters(chapterId: number): Promise<Chapter> {
    if (isEmpty(chapterId))
      throw new HttpException(400, "Chapter doesn't existId");

    const findChapter: Chapter = await this.chapters.findByPk(chapterId);
    if (!findChapter) throw new HttpException(404, "Chapter doesn't exist");

    await this.chapters.destroy({
      individualHooks: true,
      where: { id: chapterId },
    });

    return findChapter;
  }

  public async deleteChapter(
    chapterId: number,
    deletedBy: string
  ): Promise<Chapter> {
    // try {
    if (isEmpty(chapterId)) throw new HttpException(400, 'No ChapterId');

    const findChapter: Chapter = await this.chapters.findByPk(chapterId);

    if (findChapter === null)
      throw new HttpException(404, "Chapter doesn't exist");

    const now = new Date();
    const updateResult = await this.chapters.update(
      {
        deleted_by: deletedBy,
        deleted_at: now,
      },
      {
        individualHooks: true,
        where: { id: chapterId },
        returning: true,
      }
    );
    return updateResult[1][0];
    // } catch (error) {
    //   throw new HttpException(400, `${error}`);
    // }
  }

  public async associateTopic(
    chapterId: number,
    topics: Array<number>,
    transaction: Transaction
  ) {
    console.log('yutrtyuuuu');
    if (isEmpty(chapterId))
      throw new HttpException(400, "Chapter doesn't exist");
    const topics2 = await this.topics.findAll({
      where: { id: { [Op.in]: topics } },
      transaction: transaction,
    });
    const t = topics2.map((x) => x['dataValues'].id);
    console.log('tttttt', typeof t, t);
    try {
      const chapter = await this.chapters.findByPk(chapterId, { transaction });
      await chapter.setChapter_topics(t, { transaction });
      console.log('kjjjjjjjjjjjjj');
    } catch (error) {
      console.log('gygygygyg', error);
      throw new HttpException(400, error?.message);
    }
  }

  public async handlePositioning(
    chapterId: number,
    type: string,
    topicData: any,
    transaction: Transaction
  ) {
    // console.log("tyyttytyyt", transaction);
    for (const i of topicData) {
      const topicValue = await this.topics.findOne({
        where: { id: i },
        transaction: transaction,
      });
      // console.log('ddddddddd', topicValue);
      let modified;
      if (topicValue.position !== null) {
        modified = JSON.parse(topicValue.position);
      } else modified = null;
      if (modified !== null && Array.isArray(modified)) {
        if (type && type === 'update') {
          const modified_update = this.checkIfModified(
            modified,
            chapterId,
            i,
            topicData
          );
          if (modified_update) {
            modified = [...modified, { [chapterId]: topicData.indexOf(i) }];
          }
        } else if (type && type === 'create') {
          console.log('eeeeeeeeeee');
          modified = [...modified, { [chapterId]: topicData.indexOf(i) }];
        }
      } else {
        const b = [];
        b.push({ [chapterId]: topicData.indexOf(i) });
        modified = b;
      }
      topicValue.position = JSON.stringify(modified);
      console.log('here________________________');
      await topicValue.save({ transaction: transaction });
      console.log('there_________________________');
    }
  }

  public checkIfModified(position, chapterId, index, topicData) {
    let modified_update = true;
    const ack = position.find((x) => {
      console.log('qqqqqqqqqq', chapterId in x);
      if (chapterId in x) {
        x[chapterId] = topicData.indexOf(index);
        console.log('vachhha');
        modified_update = false;
      }
    });
    console.log('aaaaaaaa', modified_update);
    return modified_update;
  }

  public async searchChapter(
    req: { searchkey: string; pageNo?: number; size?: number,status?:string } = {
      searchkey: '',
      pageNo: 1,
      size: 10,
    }
  ): Promise<Chapter[]> {
    const { searchkey, pageNo = 1, size = 10,status } = req;
    const keyword = searchkey;

    // Check that pageNo and size are positive integers
    if (!Number.isInteger(pageNo) || pageNo <= 0) {
      throw new HttpException(400, 'Invalid page number');
    }

    if (!Number.isInteger(size) || size <= 0) {
      throw new HttpException(400, 'Invalid page size!');
    }

    const limit = size;
    const offset = (pageNo - 1) * limit;
    const obj = {};
      if (status !== "all") {
        obj['status'] = status;
      }
obj['deleted_at'] = {
  [Op.eq]: null,
}
    if (keyword) {
      const response: any = await this.chapters.findAndCountAll({
        where: {
          [Op.and]: [
            // {
            //   deleted_at: {
            //     [Op.eq]: null,
            //   },
            // },
            obj,
            {
              title: {
                [Op.iLike]: `%${keyword}%`,
              },
            },
          ],
        },
        limit,
        offset,
        distinct: true,
        include: [
          {
            model: this.topics,
            as: 'chapter_topics',
          },
        ],
      });

      const foundCourses: any = getPagingData(
        response,
        pageNo,
        limit,
        response.count
      );
      return foundCourses;
    } else {
      throw new HttpException(400, 'No searchKey found');
    }
  }

  public async chapterFilterSort(req: any): Promise<Chapter[]> {
    const defaultFilterParams = {
      createdBy: 'all',
      technology_skills: 'all',
      pageNo: 0,
      size: 10,
      status: 'all',
    };

    req = { ...defaultFilterParams, ...req };
    type FilterObject = {
      status?: any;
      technology_skills?: any;
      deleted_at?: any;
    };
    const where: FilterObject = {};
    if (req.status !== 'all') {
      where['status'] = req.status;
    }
    if (req.technology_skills !== 'all') {
      where['technology_skills'] = req.technology_skills;
    }
    where.deleted_at = null;

    const totalChapters = await this.chapters.count({ where: where });

    const limit = req.size;
    const offset = (req.pageNo - 1) * limit;
    const response: any = await this.chapters.findAndCountAll({
      where: where,
      // order,
      limit,
      offset,
      distinct: true,
      include: [
        {
          model: this.topics,
          as: 'chapter_topics',
        },
      ],
    });
    const filteredChapters: any = getPagingData(
      response,
      req.pageNo,
      limit,
      totalChapters
    );
    return filteredChapters;
  }

  public async verifyChapter(title: any): Promise<Chapter> {
    try {
      const findChapter: Chapter = await this.chapters.findOne({
        where: { title: title },
      });
      if (findChapter) throw new HttpException(404, 'Chapter already exist');
      return null;
    } catch (error) {
      throw new HttpException(404, error.message);
    }
  }
}

export default ChapterService;
