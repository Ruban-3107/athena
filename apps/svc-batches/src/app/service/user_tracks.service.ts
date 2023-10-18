import DB from '../database/index';
import { HttpException } from '@athena/shared/exceptions';
import { UserTrack } from '../interface/user_tracks.interface';
import {
  apiRequestHandler,
  apiRequestHandlerWithTransaction,
} from '@athena/shared/common-functions';
import {  COURSES_SERVICE_PORT, GET_TRACKS_ROUTE, COURSES_SERVICE_URL } from '../config/index';

class UserTracksService {
  public userTracks = DB.DBmodels.user_tracks;

  public async findAll(queryObj: object): Promise<UserTrack[]> {
    queryObj = { ...{ order: [['id', 'DESC']] }, ...queryObj };

    const userTracks = await this.userTracks.findAll(queryObj);

    if (!userTracks) {
      throw new HttpException(500, 'Error in finding the track');
    }
    return userTracks;
  }

  public async findByID(queryObj: object,token:string) {
    console.log('333333333333333', queryObj);
    let trackData, childId;
    if (queryObj['where'].child_id) {
      const tracksData = await apiRequestHandlerWithTransaction(
        `${COURSES_SERVICE_URL}:${COURSES_SERVICE_PORT}${GET_TRACKS_ROUTE}/${queryObj['where'].track_id}/${queryObj['where'].child_id}`,
        token,
        'GET',
        null,
        false
      );
      if (tracksData?.status === "success") {
        trackData = tracksData?.value;
      }
      // trackData = await this.trackservice.getTracks(
      //   queryObj['where'].track_id,
      //   queryObj['where'].child_id,
      //   null
      // );
      // "summary_data"
      childId = queryObj['where'].child_id;
      delete queryObj['where'].child_id;
      console.log('qqqqqqqqqqqqqqq', queryObj);
    } else {
      console.log("jjjjjjjjjjjjjjjj:",`${COURSES_SERVICE_URL}:${COURSES_SERVICE_PORT}${GET_TRACKS_ROUTE}/${queryObj['where'].track_id}`)
      const tracksData = await apiRequestHandlerWithTransaction(
        `${COURSES_SERVICE_URL}:${COURSES_SERVICE_PORT}${GET_TRACKS_ROUTE}/${queryObj['where'].track_id}`,
        token,
        'GET',
        null,
        false
      );
      if (tracksData?.status === "success") {
        trackData = tracksData?.value;
      }
      // trackData = await this.trackservice.getTracks(
      //   queryObj['where'].track_id,
      //   null,
      //   null
      // );
    }

    const uTrack = await this.userTracks.findOne(queryObj);
    let userTrack;
    if (uTrack) {
      if (childId) {
        const summary_data = JSON.parse(
          uTrack?.dataValues?.course_summary_data
        );
        const filteredSummaryData = summary_data.children.filter(
          (x) => x.id == childId
        );
        uTrack.dataValues.course_summary_data =
          JSON.stringify(filteredSummaryData);
      }
      userTrack = { track: trackData, userTrack: uTrack };
      return userTrack;
    }
    userTrack = { track: trackData, userTrack: null };
    return userTrack;
  }

  public async updateUserTrackSummaryData(
    summary_data: string,
    queryObj: object
  ) {
    const uTrack = await this.findByID({ where: queryObj },null);
    const userTrack = uTrack.userTrack;

    await userTrack.update({ summary_data });

    return userTrack;
  }

  public async getMyTracks(
    user_id: number,
    track_id: number | null,
    child_id: number | null,
    token:string
  ): Promise<UserTrack | UserTrack[]> {
    try {
      console.log('1111111');
      let userTracks;

      const fieldsToExclude = [
        'user_id',
        'track_id',
        'summary_key',
        'anonymous_during_mentoring',
        'objectives',
       
      ];

      const queryObj = {
        where: { user_id },
        attributes: {
          exclude: fieldsToExclude,
        },
        // include: [{ model: DB.DBmodels.tracks, as: 'track', include: [] }],
        order: [['last_touched_at', 'DESC']],
      };

      // if (track_id) {
      //     queryObj.where = { ...queryObj.where, ...{ track_id } };
      //     queryObj.attributes = { ...queryObj.attributes, ...{ exclude: fieldsToExclude.filter((el) => !["summary_data"].includes(el)) } };
      //     queryObj.include = [
      //         { model: DB.DBmodels.tracks, as: 'track', include: [{ model: DB.DBmodels.track_concepts, as: 'track_concepts' }] }
      //     ];
      // }

      if (child_id) {
        queryObj.where = { ...queryObj.where, ...{ child_id } };
      }

      if (track_id) {
        queryObj.where = { ...queryObj.where, ...{ track_id } };
        queryObj.attributes = {
          ...queryObj.attributes,
          ...{
            exclude: fieldsToExclude.filter(
              (el) => !['summary_data'].includes(el)
            ),
          },
        };
        // queryObj.include = [
        //   {
        //     model: DB.DBmodels.tracks,
        //     as: 'track',
        //     include: [
        //       { model: DB.DBmodels.track_concepts, as: 'track_concepts' },
        //     ],
        //   },
        // ];

        userTracks = await this.findByID(queryObj,token);
        if (!userTracks) {
          console.log('gggggggggggggggg');

          //   userTracks = await this.tracks.findOne({
          //     where: { id: track_id },
          //     include: [
          //       { model: DB.DBmodels.exercises, as: 'exercises' },
          //       {
          //         model: DB.DBmodels.track_concepts,
          //         as: 'track_concepts',
          //         include: [
          //           {
          //             model: DB.DBmodels.exercise_practiced_concepts,
          //             as: 'exercise_practiced_concepts',
          //           },
          //           {
          //             model: DB.DBmodels.exercise_taught_concepts,
          //             as: 'exercise_taught_concepts',
          //           },
          //         ],
          //       },
          //     ],
          //   });

          userTracks = userTracks.get({ plain: true });

          userTracks = {
            track: userTracks,
            // summary_data: this.getSummaryDataforNewTracks(userTracks),
            completed_exercises: 0,
            isjoined: false,
          };
        }
      } else {
        userTracks = await this.findAll(queryObj);
      }
      console.log('2222222');

      return userTracks;
    } catch (e) {
      console.log('errra', e);
      throw new HttpException(
        404,
        `Error in finding your track${track_id ? '' : 's'}`
      );
    }
  }

  public async updateUserTrackCourseSummaryData(userId, params) {
    const {
      track_id: trackId,
      child_id: childId,
      chapter_id: chapterId,
      topic_id: topicId,
    } = params;
    const queryObj = { user_id: userId, track_id: trackId };
    const userTrack = await this.userTracks.findOne({ where: queryObj });

    try {
      const sdata = JSON.parse(userTrack.course_summary_data);
      if (childId) {
        sdata?.children?.find((child) => {
          if (child.id == childId) {
            child.chapters.find((chapter) => {
              if (chapter.id == chapterId) {
                chapter.topics.find((topic) => {
                  if (topic.id == topicId) {
                    topic['completed_at'] = new Date();
                    topic['status'] = 'completed';
                  }
                });
                const topicStatus = chapter.topics.every((x) => {
                  return x.status == 'completed';
                });
                chapter['completed_at'] =
                  topicStatus == true ? new Date() : null;
                chapter['status'] =
                  topicStatus == true ? 'completed' : 'pending';
              }
            });
            const chapterStatus = child.chapters.every((x) => {
              return x.status == 'completed';
            });
            child['completed_at'] = chapterStatus == true ? new Date() : null;
            child['status'] = chapterStatus == true ? 'completed' : 'pending';
          }
        });
      } else {
        sdata?.chapters?.find((chapter) => {
          if (chapter.id == chapterId) {
            chapter.topics.find((topic) => {
              if (topic.id == topicId) {
                topic['completed_at'] = new Date();
                topic['status'] = 'completed';
              }
            });
            const topicStatus = chapter.topics.every((x) => {
              return x.status == 'completed';
            });
            chapter['completed_at'] = topicStatus == true ? new Date() : null;
            chapter['status'] = topicStatus == true ? 'completed' : 'pending';
          }
        });
      }

      userTrack.course_summary_data = JSON.stringify(sdata);
      await userTrack.save();
    } catch (error) {
      console.log('err', error);
    }

    return userTrack;
  }

  public async joinTrack(
    users: Array<number>,
    tracksAssign: Array<number>,
    batchId: number | null = null,
    token:string|null =null
  ) {
    //also check if the assigned track exists

    try {
      const a = [],trackDetail = [];
      let summary_data, course_summary_data;
      for (let i = 0; i < tracksAssign.length; i++) {
        const tracksData = await apiRequestHandlerWithTransaction(
          `${COURSES_SERVICE_URL}:${COURSES_SERVICE_PORT}${GET_TRACKS_ROUTE}/${tracksAssign[i]}`,
          token,
          'GET',
          null,
          false
        );
        if (tracksData?.status === "success") {
          trackDetail.push(tracksData?.value);
        }
        /* need to call the get tracks api */
        // const tdata = await this.trackservice.getTracks(
        //   tracksAssign[i],
        //   null,
        //   null
        // );
        // trackDetail.push(tdata);
      }
      console.log('users.length::::::::', users.length, trackDetail.length);
      // console.log("trackdetai", trackDetail.length, trackDetail);
      for (let i = 0; i < users.length; i++) {
        for (let j = 0; j < trackDetail.length; j++) {
          console.log("trackdetai", trackDetail[j]);

          // console.log("sss", users, tracksAssign, users[i], sawsweswe3dsew333333333333tracksAssign[j]);
          const [createdUserTrack] = await this.userTracks.findOrCreate({
            where: {
              user_id: users[i],
              track_id: trackDetail[j].id ?? trackDetail[j].dataValues?.id,
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
          // console.log('utra', createdUserTrack);
          console.log('after user track find or create', new Date());

          // summary_data = await this.generateSummaryData(createdUserTrack, tracksAssign[j]);
          course_summary_data = await this.generateCourseSummaryData(
            createdUserTrack,
            trackDetail[j]
          );
          //trackDetail.filter((x) => x.id == tracksAssign[j])
          // console.log("csdata", course_summary_data);

          // createdUserTrack.summary_data = JSON.stringify(summary_data);
          createdUserTrack.course_summary_data =
            JSON.stringify(course_summary_data);
          await createdUserTrack.save();

          // return summary_data;
        }
      }
      // await this.userTracks.bulkCreate(a, { returning: true });
      // console.log("before user track find or create", new Date());
      // const [createdUserTrack] = await this.userTracks.findOrCreate({
      //     where: { user_id, track_id },
      //     defaults: {
      //         summary_data: JSON.stringify({ exercises: {}, concepts: {} }),
      //         last_touched_at: new Date()
      //     }
      // });
      // console.log("after user track find or create", new Date());

      // let summary_data = await this.generateSummaryData(createdUserTrack, track_id);

      // createdUserTrack.summary_data = JSON.stringify(summary_data);

      // await createdUserTrack.save();

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
      // const courseSummaryData = trackData.track_chapters.map((x) => {
      //     return {
      //         "id": x.id,
      //         "slug": x.slug,
      //         "status": "pending",
      //         "completed_at": null,
      //         "position": x.position,
      //         "topics": (x.chapter_topics && x.chapter_topics.length > 0) ?
      //             x.chapter_topics.map((x) => {
      //                 return {
      //                     "id": x.id,
      //                     "slug": x.slug ? x.slug : " ",
      //                     "title": x.title,
      //                     "topic_type": x.topic_type,
      //                     "to_be_completed_on": x.to_be_completed_on,
      //                     "position": x.position,
      //                     "duration": x.duration,
      //                     "status": "pending",
      //                     "trainer_id": null,
      //                     "scheduled_at": null,
      //                     "completed_at": null,
      //                 }
      //             }) : []
      //     }
      // })
      return courseSummaryData;
    } catch (error) {
      console.log(error);
      throw new HttpException(500, error.message);
    }
  }
}

export default UserTracksService;
