import DB from '../database/index';
// import { HttpException } from '@exceptions/HttpException';
import { HttpException } from '@athena/shared/exceptions';
import { isEmpty } from '@athena/shared/common-functions';
import { Track } from '../interface/tracks.interface';
import { CreateTrackDto } from '../dto/tracks.dto';
import { Op, Transaction } from 'sequelize';
import ChapterService from './chapters.service';
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
import { convertToPDF, getcallfroms3 } from '@athena/shared/file-upload';

class TracksService {
  public tracks = DB.DBmodels.tracks;
  // public courses = DB.DBmodels.courses;
  // public additionalresources = DB.DBmodels.additional_resources;
  public chapters = DB.DBmodels.chapters;
  public topics = DB.DBmodels.topics;
  // public exercises = DB.DBmodels.exercises;
  public domaintechnology = DB.DBmodels.domainTechnology;
  public ChapterService = new ChapterService();

  // public getAllFuncs(toCheck) {
  //   const props = [];
  //   let obj = toCheck;
  //   do {
  //     props.push(...Object.getOwnPropertyNames(obj));
  //   } while ((obj = Object.getPrototypeOf(obj)));

  //   return props.sort().filter((e, i, arr) => {
  //     if (e != arr[i + 1] && typeof toCheck[e] == 'function') return true;
  //   });
  // }

  private async findAll(queryObj: object): Promise<Track[]> {
    queryObj = {
      // include: [
      //   {
      //     model: this.chapters,
      //     as: 'track_chapters',
      //     include: [
      //       {
      //         model: this.topics,
      //         as: 'chapter_topics',
      //         include: [
      //           {
      //             model: this.additionalresources,
      //             as: 'topic_additional_resources',
      //             required: true,
      //           },
      //         ],
      //       },
      //     ],
      //   },
      // ],
      ...queryObj,
      ...{ order: [['id', 'DESC']] },
      // where: { ...queryObj.where, deleted_at: null },
      // limit:100
    };
    queryObj['where'] = { ...queryObj['where'], deleted_at: null };
    // console.log("_________________", queryObj);
    const tracks = await this.tracks.findAll(queryObj);

    if (!tracks) {
      throw new HttpException(500, 'Error in finding the track');
    }
    const updatedTracks = await this.fetchModifiedTracks(tracks);  
    return updatedTracks;
  }

  private async fetchModifiedTracks(tracks) {
    const modifiedTracks = await Promise.all(
      tracks.map(async (track) => {
        const imageURL = await getcallfroms3(track.image_url);
        track.image_url = imageURL;
        // console.log("Modified Track:", track);
        return track;
      })
    );
  
    // console.log("Modified Tracks Array:", modifiedTracks);
    return modifiedTracks;
  }

  private async findByID(queryObj: object): Promise<Track> {
    const queryObj1 = {
      model: this.chapters,
      as: 'track_chapters',
      include: 'chapter_topics',
    };
    const queryObj2 = {
      model: this.tracks,
      as: 'children',
      // required:true
      include: [queryObj1],
    };
    // let finalAssoc = [];
    // finalAssoc = finalAssoc.concat(queryObj1, queryObj2);
    // let additionalAssoc = [
    //   'course_tracks',
    //   {
    //     model: this.chapters,
    //     as: 'course_chapters',
    //     include: [
    //       {
    //         model: this.tracks,
    //         as: 'chapter_tracks',
    //         include: [
    //           {
    //             model: this.additionalresources,
    //             as: 'track_additional_resources',
    //             limit: 1000
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // ];
    // if (queryObj['type'] && queryObj['type'] == 'summary_data') {
    //   queryObj1['include'] = additionalAssoc;
    //   delete queryObj['type'];
    // }
    // console.log('qqq', queryObj);
    // queryObj['include'].push(queryObj1);
    queryObj['include'] = queryObj['include'].concat(queryObj1, queryObj2);

    const tracks = await this.tracks.findOne(queryObj);
    // const imagekey = tracks.image_url;
    console.log("imageeeeeefilekeeeyyyy",tracks.image_url);
    const imagekeyurl = await getcallfroms3(tracks.image_url);
    tracks.image_url = imagekeyurl;
    // console.log('sdsdd', tracks);
    return tracks;
  }

  private async findTrackWithChildId(queryObj: object): Promise<Track> {
    try {
      const courseId = queryObj['child'].childId;
      const queryObj1 = {
        model: this.tracks,
        as: 'children',
        where: { id: { [Op.eq]: courseId } },
        include:
          // { all: true, nested: true },
          [
            { model: this.domaintechnology, as: 'technology_skill_track' },
            {
              model: this.chapters,
              as: 'track_chapters',
              include: [
                {
                  model: this.topics,
                  as: 'chapter_topics',
                  // include: [
                  //   {
                  //     model: this.additionalresources,
                  //     as: 'track_additional_resources',
                  //     limit: 1000,
                  //   },
                  //   //  this.additionalresources,
                  // ],
                },
              ],
            },
          ],
      };

      queryObj['include'].push(queryObj1);
      const tracks = await this.tracks.findOne(queryObj);
      return tracks;
    } catch (error) {
      console.log('err', error);
    }
  }

  public async getTracks(
    id: number | null,
    childId: number | null = null,
    status: string | null,
    type: string | null = null
  ): Promise<Track | Track[]> {
    let tracks;
    const queryObj = {
      where: {},
      include: [],
      child: {},
    };

    if (id) {
      queryObj.where = { ...queryObj.where, ...{ id } };
      // console.log('***************', !type, type != 'summary_data');

      // if (!type || type != 'summary_data') {
      // console.log('/////////////', !type, type != 'summary_data');
      queryObj.include = [
        ...queryObj.include,
        ...[{ model: this.domaintechnology, as: 'technology_skill_track' }],
        //'exercises','track_concepts',,
      ];
      // }
    }
    if (status) {
      queryObj.where = { ...queryObj.where, ...{ status } };
    }
    if (type) {
      queryObj.where = { ...queryObj.where, track_type:type  };
    }
    try {
      if (id && !childId) {
        // if (type == 'summary_data') {
        //   queryObj['type'] = 'summary_data';
        //   tracks = await this.findByID(queryObj);
        // } else {
        tracks = await this.findByID(queryObj);
        // }
        if (!tracks) throw new HttpException(404, "Track doesn't exist");
      } else if (id && childId) {
        queryObj.child = { ...queryObj.child, ...{ childId } };
        tracks = await this.findTrackWithChildId(queryObj);
      } else {
        const qobj = {
          model: this.chapters,
          as: 'track_chapters',
          // required: true,
          include: [
            {
              model: this.topics,
              as: 'chapter_topics',
              // include: [
              //   {
              //     model: this.additionalresources,
              //     as: 'topic_additional_resources',
              //     required: true,
              //   },
              // ],
            },
          ],
        };
        (queryObj.include = [
          qobj,
          {
            model: this.tracks,
            as: 'children',
            include: qobj,
          },
        ]),
          delete queryObj.child;
        tracks = await this.findAll(queryObj);
        console.log('ttttttt', tracks);
        // const fetchfilekey = tracks.image_url;
        // const imageurl = await getcallfroms3(fetchfilekey);
        // tracks.image_url = imageurl;
      }
    } catch (error) {
      console.log('eeeeeeeeee', error);
      throw new HttpException(
        404,
        `Error in finding the track${id ? '' : 's'}`
      );
    }
    return tracks;
  }

  public async getTracksWithChapterOrChild(
    id: number | null,
    type: string | null = null,
    searchKey:string | null =null
  ): Promise<Track | Track[]> {
    let tracks;
    const queryObj = {
      where: {},
      include: [],
    };

    if (id) {
      queryObj.where = { ...queryObj.where, ...{ id } };
      queryObj.include = [
        ...queryObj.include,
        // ...['exercises', 'track_concepts'],
      ];
    }
    if (searchKey) {
      queryObj.where = {
        ...queryObj.where, [Op.or] : [
          {
            title: { [Op.iLike]: `%${searchKey}%` },
          },
        ]
      };
      console.log("tytyytyt", searchKey, queryObj);

    }
    try {
      if (id) {
        tracks = await this.findByID(queryObj);
        // }
        if (!tracks) throw new HttpException(404, "Track doesn't exist");
      } else {
        if (type === 'chapters') {
          queryObj.include = [
            {
              model: this.chapters,
              as: 'track_chapters',
              required: true,
              include: [{ model: this.topics, as: 'chapter_topics' }],
            },
          ];
        } else if (type === 'children') {
          queryObj.include = [
            {
              model: this.tracks,
              as: 'children',
              required: true,
              include: {
                model: this.chapters,
                as: 'track_chapters',
                required: true,
                include: [{ model: this.topics, as: 'chapter_topics' }],
              },
            },
          ];
        }
        console.log("klklkl", queryObj);

        tracks = await this.findAll(queryObj);
        // console.log("lghgggggg", JSON.stringify(tracks));
      }
    } catch (error) {
      console.log('eeeeeeeeee', error);
      throw new HttpException(
        404,
        `Error in finding the track${id ? '' : 's'}`
      );
    }
    return tracks;
  }

  public async getTracksbyduration(dateRangeType): Promise<Track[]> {
    const end_date = new Date();
    let start_date = null;
    if (dateRangeType) {
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
    }

    const response: any = await this.tracks.findAll({
      where: { created_at: { [Op.between]: [start_date, end_date] } },
    });

    return response;
  }

  public async createTrack(
    trackData: CreateTrackDto,
    userDataFromToken: User,
    token: string,
    params: string | null
  ): Promise<Track> {
    if (params && params === 'childthroughtrack') {
      const t = getTransaction();
      const data = await this.commonTrackCreate(
        trackData,
        userDataFromToken,
        token,
        t
      );
      return data;
    } else {
      let result;
      try {
        result = await DB.sequelize.transaction(async (t) => {
          const data = await this.commonTrackCreate(
            trackData,
            userDataFromToken,
            token,
            t
          );
          return data;
        });
      } catch (error) {
        console.log('Error occurred during track creation:', error);
        throw new HttpException(400, error?.message);
      }
      return result;
    }
  }

  public async commonTrackCreate(
    trackData: CreateTrackDto,
    userDataFromToken: any,
    token: string,
    t: Transaction
  ): Promise<Track> {
    try {
      console.log("ggggggggggg", userDataFromToken);
      if (isEmpty(trackData))
        throw new HttpException(400, 'Track Data is empty');

      const findTrack: Track = await this.tracks.findOne({
        where: { slug: trackData.slug },
      });
      if (findTrack)
        throw new HttpException(
          409,
          `This track ${trackData.slug} already exists`
        );
      // const rolesuser = userDataFromToken?.userRoles?.map((x) => x.name);
      // console.log("rrrrrrrrrrrrr", userDataFromToken, rolesuser);
      // const approverTrue = rolesuser.some((x) => {
      //   return ['Super Admin', 'Admin', 'Job Architect'].includes(x);
      // })
      const rolesuser = userDataFromToken?.userRoles[0].name;
      const approverTrue = rolesuser === 'Admin' || rolesuser === 'Job Architect' || rolesuser === 'Super Admin';
      if (approverTrue) {
        trackData['approved_by'] = Number(userDataFromToken.id);
        trackData['approved_at'] = new Date();
      }
      trackData.created_by = Number(userDataFromToken.id);
      const createTrackData: Track = await this.tracks.create(
        { ...trackData },
        { transaction: t }
      );
      // let chapters = JSON.parse(trackData.chapters);
      if (trackData.chapters) {
        const finalchapterArray = [];
        for (const item of trackData.chapters) {
          if (Object.keys(item).includes('id')) {
            finalchapterArray.push(item['id']);
          } else {
            /**to create a chapter,this is the api call instead of calling the service directly */
            let chapterCreateResponse;
            try {
              setTransaction(t);
              if (approverTrue) {
                item['approved_by'] = Number(userDataFromToken.id);
                item['approved_at'] = new Date();
              }
              chapterCreateResponse = await apiRequestHandlerWithTransaction(
                `${COURSES_SERVICE_URL}:${COURSES_SERVICE_PORT}/${PATHS.TRACK_CHAPTER}`,
                token,
                'POST',
                item,
                false,
                t
              );
            } catch (error) {
              console.log('ereeererer', error);
              throw new HttpException(400, error?.message);
            }
            if (chapterCreateResponse?.status === 'success') {
              finalchapterArray.push(chapterCreateResponse?.value?.id);
            } else throw new HttpException(400, 'error in creating topic');
          }
        }
        trackData.chapters = finalchapterArray;
        // if (trackData.chapters.length > 0) {
        await this.handlePositioning(
          createTrackData.id,
          'create',
          trackData,
          'chapters',
          t
        );
        await this.associateChapterorChildTrack(
          createTrackData.id,
          trackData.chapters,
          'chapters',
          t
        );
      }
      else if (trackData.children) {
        const finalchildrenArray = [];
        for (const item of trackData.children) {
          if (Object.keys(item).includes('id')) {
            finalchildrenArray.push(item['id']);
          } else {
            /**to create a child track which is referred as a course in the front end,we're calling the create track service directly */
            let chapterCreateResponse;
            if (approverTrue) {
              item['approved_by'] = Number(userDataFromToken.id);
              item['approved_at'] = new Date();
            }
            try {
              setTransaction(t);
              chapterCreateResponse = await apiRequestHandlerWithTransaction(
                `${COURSES_SERVICE_URL}:${COURSES_SERVICE_PORT}/${PATHS.TRACK_CHILDREN}`,
                token,
                'POST',
                item,
                false,
                t
              );
            } catch (error) {
              console.log('ereeererer', error);
              throw new HttpException(400, error?.message);
            }
            if (chapterCreateResponse?.status === 'success') {
              finalchildrenArray.push(chapterCreateResponse?.value?.id);
            } else throw new HttpException(400, 'error in creating topic');
          }
        }
        trackData.children = finalchildrenArray;
        await this.handlePositioning(
          createTrackData.id,
          'create',
          trackData,
          'children',
          t
        );
        await this.associateChapterorChildTrack(
          createTrackData.id,
          trackData.children,
          'children',
          t
        );
      }
      return createTrackData;
    } catch (error) {
      console.log('error in track or course creation______________', error);
      throw new HttpException(400, error?.message);
    }
  }

  public async publishTrack(
    trackId: number,
    approvedBy: number
  ): Promise<Track[]> {
    try {
      if (isEmpty(trackId)) throw new HttpException(400, 'TrackId is empty');
      const findTrack: Track = await this.tracks.findOne({
        where: { id: trackId },
      });
      console.log(findTrack, '----hopic');
      const now = new Date();
      if (!findTrack) throw new HttpException(404, "Track doesn't exist");
      const findTrackIsPublished: Track = await this.tracks.findOne({
        where: { id: trackId, status: 'Published' },
      });
      if (findTrackIsPublished)
        throw new HttpException(404, ' already published');
      // const currentVersion = parseInt(findTrack.version, 10);
      // const newVersion = (currentVersion + 1).toString();
      await this.tracks.update(
        {
          status: 'Published',
          approved_by: approvedBy,
          approved_at: now,
          // version: newVersion,
        },
        { individualHooks: true, where: { id: trackId } }
      );
      const updateTrack: Track[] = await this.tracks.findAll({
        where: { id: trackId },
        include: ['createdUser', 'approvedUser'],
      });
      return updateTrack;
      // const fetchTopic: Topic = await this.topics.findOne({where: {id: updateResult.id},include:'user'})
      // console.log(fetchTopic,'---fetch Topic----');

      // return fetchTopic;
    } catch (error) {
      throw new HttpException(400, `${error}`);
    }
  }

  public async updateTrackStatus(
    trackId: number,
    approvedBy: any
  ): Promise<Track> {
    try {
      if (isEmpty(trackId))
        throw new HttpException(400, 'Trackid is not exist');
      const findTrack: Track = await this.tracks.findByPk(trackId);
      if (!findTrack) throw new HttpException(404, "Track doesn't exist");
      const now = new Date();
      if (findTrack.status === 'Approved') {
        const queryobj = {
          model: this.chapters,
          as: 'track_chapters',
          include: [
            {
              model: this.topics,
              as: 'chapter_topics',
            },
          ],
        };

        const trackChapters = await this.tracks.findOne({
          where: { id: trackId },
          include: [
            {
              model: this.tracks,
              as: 'children',
              include: [queryobj],
            },
            queryobj,
          ],
        });
        const trackchapter = trackChapters?.dataValues?.children;
        //console.log("===========================", trackChapters?.dataValues?.children.length > 0, trackChapters?.dataValues?.children);
        if (trackChapters?.dataValues?.children.length > 0) {   // Here Updating the course status as 'Published'
          console.log("firsttttttttttttt")
          const trackchapter = trackChapters?.dataValues?.children;
          const childlength = trackchapter.length;
          let childcount = 0;

          trackchapter.forEach(async (x) => {
            if (x?.dataValues?.status !== 'Published') {      // if course not updating, then it's update the courses status as published 
              let chapterCount = 0;
              x?.dataValues?.track_chapters?.forEach(async (y) => {
                if (y?.dataValues?.status !== 'Published') {  // if chapter not updating, then it's update the chapters status as published
                  // each chapters
                  const a = [];
                  y?.dataValues?.chapter_topics.forEach(async (z) => {  
                    // console.log("____________", y?.dataValues?.id, z?.dataValues?.status);
                    const topicObj = {};
                    topicObj['id'] = z?.dataValues?.id;
                    topicObj['status'] = z?.dataValues?.status;
                    if (z?.dataValues?.s3_bucket_filekey !== null) {
                      topicObj['s3_bucket_filekey'] = z?.dataValues.s3_bucket_filekey;
                    }
                    a.push(topicObj);
                  });
                  // console.log("aaaaaaaaaaaaaaaa", a);
                  let topicCounter = 0;
                  for (const i of a) {    // Here updating the topic status
                    if (i.status !== 'Published') {
                      if (i.s3_bucket_filekey) {
                        let pdfBuffer;
                        const topicuser = i.s3_bucket_filekey;
                        const url = await convertToPDF(topicuser);
                        console.log('ddddddddddddd', url);
                        console.log('PDF uploaded to S3:', url);
                        const pdfFilekey = `${i.title}${url}`;
                        i.s3_bucket_pdf_filekey = pdfFilekey;
                        const topicid = i.id;
                        delete i.id;
                        i.status = 'Published';
                        i.approved_by = approvedBy;
                        i.approved_at = now;
                        await this.topics.update(i, { where: { id: topicid } });
                        topicCounter++;
                        if (a.length == topicCounter) {
                          const chapterid = y.id;
                          const payload = {};
                          payload['status'] = 'Published';
                          payload['approved_by'] = approvedBy;
                          payload['approved_at'] = now;
                          const a = await this.chapters.update(payload, {
                            where: { id: chapterid },
                          });
                          chapterCount++;
                          if (
                            chapterCount == x?.dataValues?.track_chapters.length
                          ) {
                            console.log('ytytytytytytytytyt');
                            await this.tracks.update(
                              { status: 'Published', approved_by: approvedBy, approved_at:now },
                              { where: { id: x.id } }
                            );
                            childcount++;
                            if (childcount == childlength) {
                              await this.tracks.update(
                                { status: 'Published', approved_by: approvedBy, approved_at:now },
                                { where: { id: trackId } }
                              );
                            }
                          }
                        }
                        // }
                        // }
                      } else {
                        const topicid = i.id;
                        delete i.id;
                        i.status = 'Published';
                        i.approved_by = approvedBy;
                        i.approved_at = now;
                        await this.topics.update(i, { where: { id: topicid } });
                        topicCounter++;
                        if (a.length == topicCounter) {
                          const chapterid = y.id;
                          const payload = {};
                          payload['status'] = 'Published';
                          payload['approved_by'] = approvedBy;
                          payload['approved_at'] = now;
                          const a = await this.chapters.update(payload, {
                            where: { id: chapterid },
                          });
                          chapterCount++;
                          if (
                            chapterCount == x?.dataValues?.track_chapters.length
                          ) {
                            console.log('ytytytytytytytytyt');
                            await this.tracks.update(
                              { status: 'Published', approved_by: approvedBy,approved_at:now },
                              { where: { id: x.id } }
                            );
                            childcount++;
                            if (childcount == childlength) {
                              await this.tracks.update(
                                { status: 'Published', approved_by: approvedBy, approved_at:now },
                                { where: { id: trackId } }
                              );
                            }
                          }
                        }
                      }
                    } else {
                      topicCounter++;
                      if (a.length == topicCounter) {
                        const chapterid = y.id;
                        const payload = {};
                        payload['status'] = 'Published';
                        payload['approved_by'] = approvedBy;
                        payload['approved_at'] = now;
                        const a = await this.chapters.update(payload, {
                          where: { id: chapterid },
                        });
                        chapterCount++;
                        if (
                          chapterCount == x?.dataValues?.track_chapters.length
                        ) {
                          console.log('ytytytytytytytytyt');
                          await this.tracks.update(
                            { status: 'Published', approved_by: approvedBy, approved_at:now },
                            { where: { id: x.id } }
                          );
                          childcount++;
                          if (childcount == childlength) {
                            await this.tracks.update(
                              { status: 'Published',approved_by: approvedBy, approved_at:now },
                              { where: { id: trackId } }
                            );
                          }
                        }
                      }
                    }
                  }
                } else {
                  chapterCount++;
                  if (chapterCount == x?.dataValues?.track_chapters.length) {
                    console.log('ytytytytytytytytyt');
                    await this.tracks.update(     // This is for updating the course
                      { status: 'Published',approved_by: approvedBy, approved_at:now },
                      { where: { id: x.id } }
                    );
                    childcount++;
                    if (childcount == childlength) {
                      await this.tracks.update(
                        { status: 'Published',approved_by: approvedBy, approved_at:now },
                        { where: { id: trackId } }
                      );
                    }
                  }
                }
              });
            } else {     // if already updated the course, then directly updating the track  
              childcount++;
              if (childcount == childlength) {
                await this.tracks.update(
                  { status: 'Published', approved_by: approvedBy, approved_at:now },
                  { where: { id: trackId } }
                );
              }
            }
          });

          const trackdata = await this.tracks.findByPk(trackId);
          return trackdata;
        } else {    // This is for updating tracks
          const trackchapter = trackChapters?.dataValues?.track_chapters;
          let chapterCount = 0;

          for (const i of trackchapter) {
            const a = [];
            trackchapter.map((x) => {
              x.dataValues.chapter_topics.map((y) => {
                const topicobj = {};
                topicobj['id'] = y?.dataValues?.id;
                topicobj['status'] = y?.dataValues?.status;
                if (y?.dataValues?.s3_bucket_filekey !== null) {
                  topicobj['s3_bucket_filekey'] = y?.dataValues?.s3_bucket_filekey;
                }
                a.push(topicobj);
              });
            });
            let topicCounter = 0;

            for (const i of a) {
              if (i.status !== 'Published') {
                if (i.s3_bucket_filekey) {
                  const topicuser = i.s3_bucket_filekey;
                  const url = await convertToPDF(topicuser);
                  console.log('PDF uploaded to S3:', url);
                  const filekeyofPDF = `${i.title}${url}`;
                  i.s3_bucket_pdf_filekey = filekeyofPDF;
                  const topicid = i.id;
                  delete i.id;
                  i.status = 'Published';
                  i.approved_at = now;
                  i.approved_by = approvedBy;
                  await this.topics.update(i, { where: { id: topicid } });
                  topicCounter++;
                  // }
                  // }
                } else {
                  const topicid = i.id;
                  delete i.id;
                  i.status = 'Published';
                  i.approved_at = now;
                  i.approved_by = approvedBy;
                  await this.topics.update(i, { where: { id: topicid } });
                  topicCounter++;
                }
              } else {
                topicCounter++;
              }
            }
            if (a.length === topicCounter) {
              try {
                const chapterid = i.id;
                const payload = {};
                payload['status'] = 'Published';
                payload['approved_by'] = approvedBy;
                payload['approved_at'] = now
                const a = await this.chapters.update(payload, {
                  where: { id: chapterid },
                });
                chapterCount++;
              } catch (error) {
                console.log('errrrrrrrr', error);
                throw new HttpException(404, 'Track status not updated');
              }
            }
          }

          if (trackchapter.length === chapterCount) {
            await this.tracks.update(
              { status: 'Published', approved_by: approvedBy, approved_at:now },
              { where: { id: trackId } }
            );
          }
          const trackdata = await this.tracks.findByPk(trackId);
          return trackdata;
        }
      } else {
        // await this.tracks.update({ status:'Published' }, { where: { id: trackId } });
        // const trackdata = await this.tracks.findByPk(trackId);
        // return trackdata;
        throw new HttpException(404, 'First Track status need to be Approved');
      }
    } catch (err) {
      console.log('error', err);
      throw new HttpException(404, 'Track status not updated');
    }
  }

  public async updateTrack(
    trackId: number,
    trackData: CreateTrackDto,
    updateType: string | null
  ): Promise<Track> {
    if (isEmpty(trackId)) throw new HttpException(400, 'Track Id is empty');
    if (isEmpty(trackData)) throw new HttpException(400, 'Track Data is empty');
    const findTrack: any = await this.tracks.findByPk(trackId);
    if (!findTrack) throw new HttpException(404, "Track doesn't exist");

    if (updateType && updateType !== null) {
      trackData['status'] = updateType;
    }
    if (trackData.chapters) {
      for (const i of trackData.chapters) {
        const chapterValue = await this.chapters.findOne({ where: { id: i } });
        let modified = JSON.parse(chapterValue.position);
        if (modified !== null && Array.isArray(modified)) {
          let modified_update = true;
          const ack = modified.find((x) => {
            if (trackId in x) {
              x[trackId] = trackData.chapters.indexOf(i);
              modified_update = false;
            }
          });
          if (modified_update) {
            modified = [
              ...modified,
              { [trackId]: trackData.chapters.indexOf(i) },
            ];
          }
        } else {
          const b: any[] = [];
          b.push({ [trackId]: trackData.chapters.indexOf(i) });
          modified = b;
        }
        chapterValue.position = JSON.stringify(modified);
        await chapterValue.save();
      }
      // await this.associateChapter(trackId, trackData.chapters);
    }
    if (trackData.children) {
      // await this.associateChildTrack(trackId, trackData.children);
    }

    delete trackData.chapters;
    delete trackData.children;
    if (Object.keys(trackData).length > 0) {
      await this.tracks.update({ ...trackData }, { where: { id: trackId } });
    }

    const updateTrack: Track = await this.tracks.findByPk(trackId);
    return updateTrack;
  }

  public async updateStatus(trackId: number, trackData: any): Promise<Track> {
    if (isEmpty(trackId)) throw new HttpException(400, 'Track is empty');
    const findTrack: Track = await this.tracks.findOne({
      where: { id: trackId },
    });
    if (findTrack === null) throw new HttpException(404, 'Track Not Found');
    if (trackData.status === 'Approved') {
      let queryobj = {
        model: this.chapters,
        as: 'track_chapters',
        include: [
          {
            model: this.topics,
            as: 'chapter_topics',
          },
        ],
      };

      const trackChapters = await this.tracks.findOne({
        where: { id: trackId },
        include: [
          {
            model: this.tracks,
            as: 'children',
            include: [queryobj],
          },
          queryobj,
        ],
      });
      // console.log("aaaaaaaaa...................", trackChapters);
      let trackchapter = trackChapters?.dataValues?.children;
      //console.log("===========================", trackChapters?.dataValues?.children.length > 0, trackChapters?.dataValues?.children);
      if (trackChapters?.dataValues?.children.length > 0) {    // For courses only.....
        console.log("firsttttttttttttt")
        let trackcourse = trackChapters?.dataValues?.children;
        let childlength = trackcourse.length;
        let childcount = 0;

        trackcourse.forEach(async (x) => {
          if (x?.dataValues?.status !== 'Approved') {  // Each Course...
            let chapterCount = 0;
            console.log("chapter counttttttt");
            
            x?.dataValues?.track_chapters?.forEach(async (y) => { // Each Chapter...
              if (y?.dataValues?.status !== 'Approved') {
                // each chapters
                let a = [];
                y?.dataValues?.chapter_topics.forEach(async (z) => {
                  console.log("_____.............._______", y?.dataValues?.id, z?.dataValues?.status);
                  let topicObj = {};
                  topicObj['id'] = z?.dataValues?.id;
                  topicObj['status'] = z?.dataValues?.status;
                  // if (z?.dataValues?.attachment_url !== null) {
                  //   topicObj['attachment_url'] = z?.dataValues.attachment_url;
                  // }
                  a.push(topicObj);
                });
                console.log("aaaaaaaaaaaaaaaa arrayayyyyya", a);
                let topicCounter = 0;
                for (const i of a) {
                  if (i.status !== 'Approved') {
    
                    //   let pdfBuffer;
                    //   let topicuser = i.attachment_url;
                    //   let url = await convertToPDF(topicuser);
                    //   console.log('ddddddddddddd', url);
                    //   console.log('PDF uploaded to S3:', url);
                    //   i.attachment_pdf_url = url;
                    //   const topicid = i.id;
                    //   delete i.id;
                    //   i.status = 'Approved';
                    //   await this.topics.update(i, { where: { id: topicid } });
                    //   topicCounter++;
                    //   if (a.length == topicCounter) {
                    //     const chapterid = y.id;
                    //     let payload = {};
                    //     payload['status'] = 'Approved';
                    //     const a = await this.chapters.update(payload, {
                    //       where: { id: chapterid },
                    //     });
                    //     chapterCount++;
                    //     if (
                    //       chapterCount == x?.dataValues?.track_chapters.length
                    //     ) {
                    //       console.log('ytytytytytytytytyt');
                    //       await this.tracks.update(
                    //         { status: 'Approved' },
                    //         { where: { id: x.id } }
                    //       );
                    //       childcount++;
                    //       if (childcount == childlength) {
                    //         await this.tracks.update(
                    //           { status: 'Approved' },
                    //           { where: { id: trackId } }
                    //         );
                    //       }
                    //     }
                    //   }
                    //   // }
                    //   // }
                    // } else {
                    const topicid = i.id;
                    delete i.id;
                    i.status = 'Approved';
                    await this.topics.update(i, { where: { id: topicid } });
                    topicCounter++;
                    
                  } else {
                    topicCounter++;
                   
                  }
                  if (a.length === topicCounter) {
                    const chapterid = y.id;
                    let payload = {};
                    payload['status'] = 'Approved';
                    const a = await this.chapters.update(payload, {
                      where: { id: chapterid },
                    });
                    chapterCount++;
                  
                  }
                }
              } else {
                chapterCount++;
               
              }
              if (chapterCount == x?.dataValues?.track_chapters.length) {
                console.log('ytytytytytytytytyt');
                await this.tracks.update(
                  { status: 'Approved' },
                  { where: { id: x.id } }
                );
                childcount++;
                if (childcount == childlength) {
                  await this.tracks.update(
                    { status: 'Approved' },
                    { where: { id: trackId } }
                  );
                }
              }
            });
          } else {
            childcount++;
            if (childcount == childlength) {
              await this.tracks.update(
                { status: 'Approved' },
                { where: { id: trackId } }
              );
            }
          }
        });

        const trackdata = await this.tracks.findByPk(trackId);
        return trackdata;
      } else {    // This is for only tracks
        console.log('seconddddddddddddddddddd');
        let trackchapter = trackChapters?.dataValues?.track_chapters;
        let chapterCount = 0;

        for (const i of trackchapter) {
          let a = [];
          trackchapter.map((x) => {
            x.dataValues.chapter_topics.map((y) => {
              console.log('___________________', y);
              let topicobj = {};
              topicobj['id'] = y?.dataValues?.id;
              topicobj['status'] = y?.dataValues?.status;
              a.push(topicobj);
            });
          });
          let topicCounter = 0;

          for (const i of a) {
            if (i.status !== 'Approved') {
             
                const topicid = i.id;
                delete i.id;
                i.status = 'Approved';
                await this.topics.update(i, { where: { id: topicid } });
                topicCounter++;
            } else {
              topicCounter++;
            }
          }
          if (a.length === topicCounter) {
            try {
              const chapterid = i.id;
              let payload = {};
              payload['status'] = 'Approved';
              const a = await this.chapters.update(payload, {
                where: { id: chapterid },
              });
              chapterCount++;
            } catch (error) {
              console.log('errrrrrrrr', error);
            }
          }
        }

        if (trackchapter.length === chapterCount) {
          await this.tracks.update(
            { ...trackData },
            { where: { id: trackId } }
          );
        }
        const trackdata = await this.tracks.findByPk(trackId);
        return trackdata;
      }
    }
  }

  public async publishTracks(
    trackId: number,
    approvedBy: number,
    trackStatus = 'Approved'
  ): Promise<Track[]> {
    try {
      if (isEmpty(trackId)) throw new HttpException(400, 'TrackId is empty');
      const findTrack: Track = await this.tracks.findOne({
        where: { id: trackId },
      });
      const now = new Date();
      if (!findTrack) throw new HttpException(404, "Track doesn't exist");
      const findTrackIsPublished: Track = await this.tracks.findOne({
        where: { id: trackId, status: 'Published' },
      });
      if (findTrackIsPublished)
        throw new HttpException(404, 'Track already published');
      // const currentVersion = parseInt(findTrack.version, 10);
      // const newVersion = (currentVersion + 1).toString();
      await this.tracks.update(
        {
          status: trackStatus,
          approved_by: approvedBy,
          approved_at: now,
          updated_by: approvedBy,
          updated_at: now,
          // version: newVersion,
        },
        { individualHooks: true, where: { id: trackId } }
      );
      const updateTrack: Track[] = await this.tracks.findAll({
        where: { id: trackId },
        // include: ['createdUser', 'approvedUser'],
      });
      return updateTrack;
      // const fetchTopic: Topic = await this.topics.findOne({where: {id: updateResult.id},include:'user'})
      // console.log(fetchTopic,'---fetch Topic----');

      // return fetchTopic;
    } catch (error) {
      throw new HttpException(400, `${error}`);
    }
  }

  public async deleteTrack(trackId: number, deletedBy: number): Promise<Track> {
    try {
      if (isEmpty(trackId)) throw new HttpException(400, 'No TrackId');
      const findTrack: Track = await this.tracks.findByPk(trackId);
      if (findTrack === null)
        throw new HttpException(404, "Track doesn't exist");

      const now = new Date();
      const updateResult = await this.tracks.update(
        {
          deleted_by: deletedBy,
          deleted_at: new Date(),
        },
        {
          // individualHooks: true,
          where: { id: trackId },
          returning: true,
        }
      );
      console.log('update', updateResult[1][0]);

      return updateResult[1][0];
    } catch (error) {
      throw new HttpException(400, `${error}`);
    }
  }

  public async associateChapterorChildTrack(
    trackId: number,
    items: Array<number>,
    data_type: string,
    transaction: Transaction
  ) {
    try {
      if (isEmpty(trackId))
        throw new HttpException(400, "Course doesn't exist");
      let associations;
      if (data_type === 'chapters') {
        associations = await this.chapters.findAll({
          where: { id: { [Op.in]: items } },
          transaction: transaction,
        });
      } else if (data_type === 'children') {
        associations = await this.tracks.findAll({
          where: { id: { [Op.in]: items } },
          transaction: transaction,
        });
      }

      const associationArray = associations.map((x) => x['dataValues'].id);
      try {
        const track = await this.tracks.findByPk(trackId, { transaction });
        // .then(async (track) => {
        if (data_type === 'chapters') {
          const to = await track.setTrack_chapters(associationArray, {
            transaction,
          });
          console.log('qqqqqqqqqqqqqqqq', to);
        } else if (data_type === 'children') {
          const to = await track.setChildren(associationArray, { transaction });
          console.log('qqqqqqqqqqqqqqqq', to);
        }
        // });
      } catch (error) {
        console.log(error);
        throw new HttpException(400, error?.message);
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(400, error?.message);
    }
  }

  public async handlePositioning(
    trackId: number,
    type: string,
    trackData: any,
    data_type: string,
    transaction: Transaction
  ) {
    for (const i of trackData[data_type]) {
      let dataValue;
      if (data_type === 'chapters') {
        dataValue = await this.chapters.findOne({
          where: { id: i },
          transaction: transaction,
        });
      } else if (data_type === 'children') {
        dataValue = await this.tracks.findOne({
          where: { id: i },
          transaction: transaction,
        });
      }
      if (dataValue) {
        let modified;
        if (dataValue.position !== null) {
          modified = JSON.parse(dataValue.position);
        } else modified = null;
        // let modified = JSON.parse(dataValue.position);
        if (modified !== null && Array.isArray(modified)) {
          if (type && type === 'update') {
            const modified_update = this.checkIfModified(
              modified,
              trackId,
              i,
              trackData,
              data_type
            );
            if (modified_update) {
              modified = [
                ...modified,
                { [trackId]: trackData[data_type].indexOf(i) },
              ];
            }
          } else if (type && type === 'create') {
            modified = [
              ...modified,
              { [trackId]: trackData[data_type].indexOf(i) },
            ];
          }
        } else {
          const b = [];
          b.push({ [trackId]: trackData[data_type].indexOf(i) });
          modified = b;
        }
        dataValue.position = JSON.stringify(modified);
        await dataValue.save({ transaction: transaction });
      }
    }
  }

  public checkIfModified(position, trackId, index, trackData, data_type) {
    let modified_update = true;
    const ack = position.find((x) => {
      console.log('qqqqqqqqqq', trackId in x);
      if (trackId in x) {
        x[trackId] = trackData[data_type].indexOf(index);
        console.log('vachhha');
        modified_update = false;
      }
    });
    console.log('aaaaaaaa', modified_update);
    return modified_update;
  }

  /**Filter tracks based on track_type*/
  public async searchAndFilterTracks(trackType: string): Promise<any> {
    console.log('eeeeeeeeeee');
    const filteredTracks: Track[] = await this.tracks.findAll({
      where: { track_type: trackType },
      order: [['id', 'DESC']],
    });

    return filteredTracks;
  }
  /**Filter tracks based on track_type*/

  /**Filter and search tracks with search key and status*/

  public async searchTracks(req: any): Promise<any> {
    const { searchkey } = req;

    const keyword = searchkey;
    const whereCondition = {
      deleted_at: null,
    };

    if (keyword) {
      const response: Track[] = await this.tracks.findAll({
        where: {
          [Op.and]: [
            //  whereCondition,
            {
              [Op.or]: [{ title: { [Op.iLike]: `%${keyword}%` } }],
            },
          ],
        },
        include: [
          {
            model: this.tracks,
            as: 'children',
            attributes: ['title'],
            include: [
              {
                model: this.chapters,
                as: 'track_chapters',
                attributes: ['title', 'description'],
                include: [
                  {
                    model: this.topics,
                    as: 'chapter_topics',
                    attributes: ['title', 'duration'],
                  },
                ],
              },
            ],
          },
          {
            model: this.chapters,
            as: 'track_chapters',
            include: [
              {
                model: this.topics,
                as: 'chapter_topics',
              },
            ],
          },
        ],
      });
      console.log("yuyuyuy", response);
      const updatedTracks = await this.fetchModifiedTracks(response);
      return updatedTracks;
    } else {
      console.log('no keyword');
    }
  }

  /**Filter and search tracks with search key and status*/
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////NEW SERVICE TO AVOID CONFUSION/////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**NEW STUFF TRACKS*/
  public async newFilterTracks(req: any): Promise<any> {
    // return 'New filter Tracks';

    const where = { deleted_at: null, ...req };

    const response = await this.tracks.findAll({
      where: { ...where },
      include: [],
      attributes: ['title', 'status', 'track_type', 'technology_skills'],
    });

    return response;
  }

  /**NEW STUFF TRACKS*/

  public async newSearchTracks(req: any, limit = 10): Promise<any> {
    const { searchKey } = req;

    const where: {
      technology_skills?: string;
      track_type?: string;
      status?: string;
      level?: string;
      deleted_at?: any;
    } = {
      deleted_at: null,
    };

    if (req.technology_skills) {
      where.technology_skills = req.technology_skills;
    }
    if (req.track_type) {
      where.track_type = req.track_type;
    }
    if (req.status) {
      where.status = req.status;
    }
    if (req.level) {
      where.level = req.level;
    }
    if (searchKey) {
      where[Op.or] = [
        {
          title: {
            [Op.iLike]: `%${searchKey}%`,
          },
        },
      ];
    }

    const response = await this.tracks.findAll({
      where,
      order: [[`created_at`, 'DESC']],
      include: [
        {
          model: this.tracks,
          as: 'children',
          required: true,
          attributes: ['title'],
          include: [
            {
              model: this.chapters,
              as: 'track_chapters',
              attributes: ['title', 'description'],
              include: [
                {
                  model: this.topics,
                  as: 'chapter_topics',
                  attributes: ['title', 'duration'],
                },
              ],
            },
          ],
        },
      ],

      attributes: [
        'id',
        'title',
        'level',
        'status',
        'image_url',
        // 'track_type',
        'technology_skills',
        'created_at',
      ],

      // limit,
    });
    const updatedTracks = await this.fetchModifiedTracks(response);
    const formatDuration = (hours, minutes) => {
      let formattedDuration = '';
      if (hours > 0) {
        formattedDuration += `${hours} ${hours === 1 ? 'hr' : 'hrs'}`;
      }
      if (minutes > 0) {
        formattedDuration += ` ${minutes} ${minutes === 1 ? 'min' : 'mins'}`;
      }
      return formattedDuration.trim();
    };

    const result = updatedTracks.map(({ dataValues }) => {
      const { children, ...rest } = dataValues;

      let chaptersCount = 0;
      let topicsCount = 0;
      let totalDuration = 0;

      if (children.length !== 0) {
        chaptersCount = children.reduce((count, child) => {
          if (child.track_chapters && Array.isArray(child.track_chapters)) {
            return count + child.track_chapters.length;
          }

          return count;
        }, 0);

        topicsCount = children[0].track_chapters.reduce((count, topic) => {
          if (topic.chapter_topics && Array.isArray(topic.chapter_topics)) {
            return count + topic.chapter_topics.length;
          }

          return count;
        }, 0);

        totalDuration = children.reduce((duration, child) => {
          if (child.track_chapters && Array.isArray(child.track_chapters)) {
            return (
              duration +
              child.track_chapters.reduce((chapterDuration, chapter) => {
                if (
                  chapter.chapter_topics &&
                  Array.isArray(chapter.chapter_topics)
                ) {
                  return (
                    chapterDuration +
                    chapter.chapter_topics.reduce(
                      (topicDuration, topic) =>
                        topicDuration + parseFloat(topic.duration || 0),

                      0
                    )
                  );
                }

                return chapterDuration;
              }, 0)
            );
          }

          return duration;
        }, 0);
      }

      const hours = Math.floor(totalDuration / 60);
      const minutes = Math.round(totalDuration % 60);
      const formattedDuration = formatDuration(hours, minutes);

      const finalObj = {
        // dataValues,
        id:dataValues.id,
        title: dataValues.title,
        level: dataValues.level,
        technology_skills: dataValues.technology_skills,
        status: dataValues.status,
        created_at: dataValues.created_at,
        coursesCount: children.length,
        chaptersCount,
        topicsCount,
        image_url: dataValues.image_url,
        totalDuration: formattedDuration,
      };
      if (children.length === 0) {
        finalObj.totalDuration = '0 hrs 0 mins';
      }

      return finalObj;
    });

    return result;
  }

  /**NEW STUFF COURSES*/
  public async newSearchCourses(req: {
    searchKey: string;
    technology_skills?: string;
    track_type?: string;
    status?: string;
    level?: string;
  }): Promise<any> {
    const { searchKey } = req;

    const where: {
      technology_skills?: string;
      track_type?: string;
      status?: string;
      level?: string;
      deleted_at?: any;
    } = {
      deleted_at: null,
    };

    if (req.technology_skills) {
      where.technology_skills = req.technology_skills;
    }
    if (req.track_type) {
      where.track_type = req.track_type;
    }
    if (req.status) {
      where.status = req.status;
    }
    if (searchKey) {
      where[Op.or] = [
        {
          title: { [Op.iLike]: `%${searchKey}%` },
        },
      ];
    }

    const response = await this.tracks.findAll({
      where,

      include: [
        {
          model: this.chapters,
          as: 'track_chapters',
          required: true,
          attributes: ['title', 'description'],
          include: [
            {
              model: this.topics,
              as: 'chapter_topics',
              attributes: ['title', 'duration'],
            },
          ],
        },
      ],
      logging: console.log,
    });
    const updatedTracks = await this.fetchModifiedTracks(response);
    // const result = response
    //   .filter(({ dataValues: { children } }) => children.length === 0)
    //   .map(({ dataValues }) => {
    //     const { children, ...rest } = dataValues;
    //     return rest;
    //   });

    return updatedTracks;
  }

  public async getNeededTracks(tracks: any, token: User): Promise<Track[]> {
    try {
      console.log('sr......................', tracks);

      const findtracks: Track[] = await this.tracks.findAll({
        where: {
          id: {
            [Op.in]: tracks,
          },
        },

        include: [
          {
            model: this.tracks,

            as: 'children',

            include: [
              {
                model: this.chapters,

                as: 'track_chapters',

                include: [
                  {
                    model: this.topics,

                    as: 'chapter_topics',
                  },
                ],
              },
            ],
          },
          {
            model: this.chapters,

            as: 'track_chapters',

            include: [
              {
                model: this.topics,

                as: 'chapter_topics',
              },
            ],
          },
        ],
      });
      tracks.forEach((x) => {
        Object.entries(x).forEach(([key, value]) => {
          findtracks.find((track) => {
            if (Number(track.id) === Number(value)) {
              x[key] = track;
            }
          });
        });
      });

      return findtracks;
    } catch (error) {
      console.log('errorrrrr', error);
    }
  }
}

export default TracksService;
