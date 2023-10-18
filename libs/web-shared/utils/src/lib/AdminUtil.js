import * as yup from 'yup';
import { create_course_validations, create_chapter_validations, create_track_validations, create_topic_validations } from './FormValidationErrorMessages';

export const isFoundTopic = (array, topicId) => {
  console.log('arrrrr', array, topicId);
  const duplicate = array.some(list => list.topic_id === topicId);
  return !!(duplicate);
}

export const isFoundChapter = (array, ChapterId) => {
  const duplicate = array.some(list => list.chapter_id === ChapterId);
  return !!(duplicate);
}

export const isFoundCourse = (array, CourseId) => {
  const duplicate = array.some(list => list.course_id === CourseId);
  return !!(duplicate);
}

export const userdropzonelabel = {
  title: 'Click or drag your file to upload',
  size: 'Maximum size 10MB .',
  type: ' *.doc , *.docx , *.ppt , *.pptx, *.pdf, *.mp4 only'
};

export const getImagePath = (extension) => {
  switch (extension) {
    case 'xlsx':
      return 'assets/xlxs.png';
    case 'xls':
      return 'assets/xls.png';
    case 'pptx':
      return 'assets/PPT.png';
    case 'pdf':
      return 'assets/PDFF.png';
    case 'mp4':
      return 'assets/video.png';
    case 'doc':
    case 'docx':
      return 'assets/docx.png';
    default:
      return 'assets/default.png';
  }
}


export const userdropzonelabelImage = {
  title: 'Drag and drop or click to choose a file.',
  size: ' Minimum height: 1080px and width: 566px',
  type: 'PNG, JPG, GIF files allowed  (Max 2mb)',
};

export const addTrackSchema = yup.object().shape({
  title: yup
    .string()
    .required(create_track_validations?.track_title)
    .min(3, create_track_validations?.track_title_min)
    .max(255, create_track_validations?.track_title_max)
    .matches(/^(?!^\s+$)(?!-)(?!.*\d)[\w\s-]{3,255}$/, 'Invalid Track Name'),
    blurb: yup
    .string()
    .nullable()
    .notRequired()
    .matches(
      /^(?!\s+$)[\w\s.,"'?!]{0,1000}$/, // Updated regex to disallow only spaces at the beginning and allow up to 1000 characters
      'Invalid description'
    ),
  prerequisites: yup
    .string()
    .optional()
    .matches(/^(?!^\s+$)(?!.*\d)[\w\s]{3,100}$/, 'Invalid prerequisites'),
  level: yup.string().optional(),
  permission: yup.string().optional(),
  technology_skills: yup.string().required(create_track_validations?.domain_subject),
  track_type: yup.string().optional(),
  children: yup
    .array()
    .of(
      yup.object().shape({
        course_id: yup.string().optional(),
        title: yup.string().when('course_id', {
          is: (val) => val === undefined,
          then: yup
            .string()
            .required(create_course_validations?.course_title)
            .min(3, create_course_validations?.course_title_min)
            .max(255, create_course_validations?.course_title_max),
        }),
        blurb: yup
        .string()
        .nullable()
        .notRequired()
        .matches(
          /^(?!\s+$)[\w\s.,"'?!]{0,1000}$/, // Updated regex to disallow only spaces at the beginning and allow up to 1000 characters
          'Invalid description'
        ),
        prerequisites: yup.string().when('course_id', {
          is: (val) => val === undefined,
          then: yup.string().optional(),
        }),
        level: yup.string().when('course_id', {
          is: (val) => val === undefined,
          then: yup.string().optional(),
        }),
        permission: yup.string().when('course_id', {
          is: (val) => val === undefined,
          then: yup.string().optional(),
        }),
        technology_skills: yup.string().when('course_id', {
          is: (val) => val === undefined,
          then: yup.string().required(create_course_validations?.tech_skill),
        }),
        track_type: yup.string().when('course_id', {
          is: (val) => val === undefined,
          then: yup.string().optional(),
        }),
        chapters_details: yup.array().when('course_id', {
          is: (val) => val === undefined,
          then: yup
            .array()
            .required(create_course_validations?.add_chapter)
            .of(
              yup.object().shape({
                chapter_id: yup.string().optional(),
                title: yup.string().when('chapter_id', {
                  is: (val) => val === undefined,
                  then: yup
                    .string()
                    .required(create_chapter_validations?.chapter_title)
                    .min(3, create_chapter_validations?.chapter_title_min)
                    .max(255, create_chapter_validations?.chapter_title_max),
                }),
                description: yup
                  .string()
                  .nullable()
                  .notRequired()
                  .matches(
                    /^(?!\s+$)[\w\s.,"'?!]{0,1000}$/, // Updated regex to disallow only spaces at the beginning and allow up to 1000 characters
                    'Invalid description'
                  ),
                level: yup.string().when('chapter_id', {
                  is: (val) => val === undefined,
                  then: yup.string().optional(),
                }),
                technology_skills: yup.string().when('chapter_id', {
                  is: (val) => val === undefined,
                  then: yup.string().required(create_chapter_validations?.tech_skill),
                }),
                topics: yup.array().when('chapter_id', {
                  is: (val) => val === undefined,
                  then: yup
                    .array()
                    .required()
                    .min(1, create_chapter_validations?.add_topic)
                    .of(
                      yup.object().shape({
                        topic_id: yup.string().optional(),
                        title: yup.string().when('topic_id', {
                          is: (val) => val === undefined,
                          then: yup
                            .string()
                            .required(create_topic_validations?.topic_name)
                            .min(3, create_topic_validations?.topic_name_min)
                            .max(255, create_topic_validations?.topics_name_max),
                        }),
                        description: yup
                          .string()
                          .nullable()
                          .notRequired()
                          .matches(
                            /^(?!\s+$)[\w\s.,"'?!]{0,1000}$/, // Updated regex to disallow only spaces at the beginning and allow up to 1000 characters
                            'Invalid description'
                          ),
                        topic_type: yup.string().when('topic_id', {
                          is: (val) => val === undefined,
                          then: yup.string().required(create_topic_validations?.topic_type),
                        }),
                        delivery_type: yup.string().when('topic_id', {
                          is: (val) => val === undefined,
                          then: yup
                            .string()
                            .required(create_topic_validations?.delivery_type),
                        }),
                        duration: yup.number().when('topic_id', {
                          is: (val) => val === undefined,
                          then: yup.number().required(create_topic_validations?.duration),
                        }),
                        level: yup.string().when('topic_id', {
                          is: (val) => val === undefined,
                          then: yup.string().optional(),
                        }),
                        topic_link: yup
                          .string()
                          .nullable()
                          .when('topic_id', {
                            is: (val) => val == undefined,
                            then: yup.string().when('topic_type', {
                              is: (val) => val === 'Topic Link',
                              then: yup
                                .string()
                                .required(create_topic_validations?.topic_link),
                              otherwise: yup.string(),
                            }),
                            // otherwise:yup.string().optional()
                          }),
                      })
                    ),
                }),
              })
            ),
        }),
      })
    )
    .required()
    .min(1, create_track_validations?.add_course),
});

export const addCourseSchema = yup.object().shape({
  title: yup.string().required(create_course_validations?.course_title).matches(/^\s*\S.*[a-zA-Z]{0,30}$/, 'Title is required'),
  blurb: yup
    .string()
    .nullable()
    .notRequired()
    .matches(
      /^(?!\s+$)[\w\s.,"'?!]{0,1000}$/, // Updated regex to disallow only spaces at the beginning and allow up to 1000 characters
      'Invalid description'
    ),
  prerequisites: yup.string().optional().matches(/^\s*\S.*[a-zA-Z]{0,30}$/, 'Prerequisites is required'),
  level: yup.string().optional(),
  permission: yup.string().optional(),
  technology_skills: yup.string().required(create_course_validations?.tech_skill),
  track_type: yup.string().optional(),
  chapters_details: yup.array().when('chapter_id', {
    is: val => val === undefined,
    then: yup.array().required().min(1, create_course_validations?.add_chapter)
  }).of(
    yup.object().shape({
      chapter_id: yup.string().optional(),
      title: yup
        .string()
        .when('chapter_id', {
          is: val => val === undefined,
          then: yup.string().required(create_chapter_validations?.chapter_title)
            .min(3, create_chapter_validations?.chapter_title_min)
            .max(255, create_chapter_validations?.chapter_title_max),
        }),
      description: yup
        .string()
        .nullable()
        .notRequired()
        .matches(
          /^(?!\s+$)[\w\s.,"'?!]{0,1000}$/, // Updated regex to disallow only spaces at the beginning and allow up to 1000 characters
          'Invalid description'
        ),
      level: yup
        .string()
        .when('chapter_id', {
          is: val => val === undefined,
          then: yup.string().optional()
        }),
      technology_skills: yup
        .string()
        .when('chapter_id', {
          is: val => val === undefined,
          then: yup.string().required(create_chapter_validations?.tech_skill)
        }),
      topics: yup.array().when('chapter_id', {
        is: val => val === undefined,
        then: yup.array().required().min(1, create_chapter_validations?.add_topic)
          .of(
            yup.object().shape({
              topic_id: yup.string().optional(),
              title: yup
                .string()
                .when('topic_id', {
                  is: val => val === undefined,
                  then: yup.string().required(create_topic_validations?.topic_name)
                    .min(3, create_topic_validations?.topic_name_min)
                    .max(255, create_topic_validations?.topics_name_max),
                }),
              description: yup
                .string()
                .nullable()
                .notRequired()
                .matches(
                  /^(?!\s+$)[\w\s.,"'?!]{0,1000}$/, // Updated regex to disallow only spaces at the beginning and allow up to 1000 characters
                  'Invalid description'
                ),
              topic_type: yup
                .string()
                .when('topic_id', {
                  is: val => val === undefined,
                  then: yup.string().required(create_topic_validations?.topic_type),
                }),
              delivery_type: yup.string().when('topic_id', {
                is: val => val === undefined,
                then: yup.string().required(create_topic_validations?.delivery_type),
              }),
              duration: yup.number().when('topic_id', {
                is: val => val === undefined,
                then: yup.number().required(create_topic_validations?.duration),
              }),
              level: yup.string().when('topic_id', {
                is: val => val === undefined,
                then: yup.string().optional(),
              }),
              topic_link: yup.string().nullable().when('topic_id', {
                is: (val) => val == undefined,
                then: yup.string().when('topic_type', {
                  is: (val) => val === 'Topic Link',
                  then: yup.string().required(create_topic_validations?.topic_link),
                  otherwise: yup.string()
                }),
                // otherwise:yup.string().optional()
              }),
            })
          )

      })
    }),
  )
  // .required().min(1, 'At least add one Chapter'),
});

export const addChapterSchema = yup.object().shape({
  title: yup
    .string()
    .required(create_chapter_validations?.chapter_title)
    .min(3, create_chapter_validations?.chapter_title_min)
    .max(255, create_chapter_validations?.chapter_title_max)
    .matches(/^\s*\S.*[A-Za-z0-9]*$/, 'Invalid chapter title'),
  description: yup
    .string()
    .nullable()
    .notRequired()
    .matches(
      /^(?!\s+$)[\w\s.,"'?!]{0,1000}$/, // Updated regex to disallow only spaces at the beginning and allow up to 1000 characters
      'Invalid description'
    ),
  level:yup.string().required('Please select a difficulty level.'),
  technology_skills: yup
    .string()
    .required(create_chapter_validations?.tech_skill),
  topics: yup
    .array()
    .required()
    .min(1, 'At least add one topic')
    .of(
      yup.object().shape({
        topic_id: yup.number().optional(),
        title: yup.string().when('topic_id', {
          is: (val) => val === undefined,
          then: yup
            .string()
            .required(create_topic_validations?.topic_name)
            .min(3, create_topic_validations?.topic_name_min)
            .max(255, create_topic_validations?.topic_name_max)
            .matches(/^\s*\S.*[a-zA-Z]{3,255}$/, 'Invalid Topic Name'),
        }),
        description: yup
          .string()
          .nullable()
          .notRequired()
          .matches(
            /^(?!\s+$)[\w\s.,"'?!]{0,1000}$/, // Updated regex to disallow only spaces at the beginning and allow up to 1000 characters
            'Invalid description'
          ),
        topic_type: yup.string().when('topic_id', {
          is: (val) => val === undefined,
          then: yup.string().required(create_topic_validations?.topic_type),
        }),
        delivery_type: yup.string().when('topic_id', {
          is: (val) => val === undefined,
          then: yup.string().required(create_topic_validations?.delivery_type),
        }),
        duration: yup.number().when('topic_id', {
          is: (val) => val === undefined,
          then: yup.number().required(create_topic_validations?.duration),
        }),
        level: yup.string().when('topic_id', {
          is: (val) => val === undefined,
          then: yup.string().required(create_topic_validations?.level),
        }),
        topic_link: yup
          .string()
          .nullable()
          .when('topic_id', {
            is: (val) => val == undefined,
            then: yup.string().when('topic_type', {
              is: (val) => val === 'Topic Link',
              then: yup.string().required(create_topic_validations?.topic_link),
              otherwise: yup.string(),
            }),
            // otherwise:yup.string().optional()
          }),
        file: yup.mixed().when('topic_id', {
          is: (val) => val == undefined,
          then: yup.mixed().when('topic_type', {
            is: (val) => val !== 'Topic Link',
            then: yup.mixed().required('File is required'),
          }),
        }),
      })
    ),
});

export const createTopicSchema = yup.object().shape({
  title: yup
    .string()
    .required(create_topic_validations?.topic_name)
    .min(3, create_topic_validations?.topic_name_min)
    .max(255, create_topic_validations?.topic_name_max)
    .matches(/^\s*\S.*[A-Za-z0-9]{3,255}$/, create_topic_validations?.topic_name_pattren),
  description: yup
    .string()
    .nullable()
    .notRequired()
    .matches(
      /^(?!\s+$)[\w\s.,"'?!]{0,1000}$/, 
      create_topic_validations?.description
    ),
  topic_type: yup
    .object()
    .shape({
      name: yup.string().required(create_topic_validations?.topic_type),
    })
    .nullable()
    .required(create_topic_validations?.topic_type),

  delivery_type: yup
    .object()
    .shape({
      name: yup.string().required(create_topic_validations?.delivery_type),
    })
    .nullable()
    .required(create_topic_validations?.delivery_type),
  duration: yup.number().required(create_topic_validations?.duration),
  technology_skills: yup
    .string()
    .required(create_topic_validations?.tech_skill),
  selectedDifficulty: yup.string().required(create_topic_validations?.level),
  topic_link: yup
    .string()
    .when(
      ['topic_type', 'topic_type.name'],
      (topicType, topicTypeName, schema) => {
        if (topicTypeName === 'Topic Link') {
          return schema
            .required(create_topic_validations?.topic_link)
            .matches(/^\S.*$/,create_topic_validations?.topic_link_pattern);

        } else {
          return schema.nullable();
        }
      }
    )
    .default(null),
  file: yup
    .mixed()
    .required(create_topic_validations?.file)
  // .test("fileSize", "The file is too large", (value) => {
  //   return value && value[0].size <= 2000000;
  // })
  // .test("type", "Only the following formats are accepted:  .pdf, .doc, .ppt, and .mp4", (value) => {
  //   return (
  //     value && [
  //     // value[0].type === 'application/pdf' ||
  //     value[0].type === "application/msword" ||
  //     value[0].type === "application/vnd.ms-powerpoint" ||
  //     value[0].type === "video/mp4"
  //   ])
  // }),

});