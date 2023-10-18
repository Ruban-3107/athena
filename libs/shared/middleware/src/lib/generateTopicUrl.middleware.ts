import formidable from 'formidable';
import { NextFunction, Response, Request } from 'express';
import {
  S3Client,
  CreateBucketCommand,
  PutObjectCommand,
  HeadBucketCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY, AWS_BUCKET, AWS_ENDPOINT, HOST_IP } from '../app/config/index';
import fs from 'fs';
import { resolve } from 'path/posix';

const form1 = formidable({ multiples: true });

const s3 = new S3Client({
  endpoint: AWS_ENDPOINT,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID ?? 'athena-dev-key',
    secretAccessKey: AWS_SECRET_ACCESS_KEY ?? 'aTBaS18Qjb',
  },
  forcePathStyle: true, // needed with minlo
  region: AWS_REGION,
});

const getUrl = async (req: Request,next: NextFunction,type: string,allTopics: number,
  processedAllTopics: number,
  files: any,
  fields: any,
  allChapters: number | null,
  processedAllChapters: number | null
) => {
  console.log('kkkkkkk', typeof fields[type], fields[type]);

  if (type === 'chapters') {
    for (let i of fields[type] as any[]) {
      const item: any = i;
      let processedTopicsforChapter = 0;
      if (!('id' in item)) {
        console.log('ttttrttttt');
        // let processedTopicsforChapter = 0;
        for (let topic of item.topics) {
          const topicItem: any = topic;
          if (!('id' in topicItem) && !('topic_link' in topicItem)) {
            try {
              console.log('jhhhhhhhh');
              const file: any =
                files[
                  `chapters[${fields.chapters.indexOf(
                    i
                  )}][topics][${item.topics.indexOf(topic)}][file]`
                ];
              const fileKey = file['originalFilename'];
              const fileStream = fs.createReadStream(file['filepath']);
              const params = {
                Bucket: AWS_BUCKET,
                Key: fileKey,
                Body: fileStream,
                ContentType: file['mimetype'],
              };
              // s3.upload(params, function (err: any, data: any) {
              //     if (err) {
              //         console.log('////////////', err);
              //     }
              //     if (data) {
              //         console.log('success', data);
              //         topicItem['attachment_url'] = data.Location;
              //         topic = topicItem;
              //         processedTopics += 1;
              //         console.log("topiccccccccccccc", topic, processedTopics, totalTopics);
              //         if (processedTopics === totalTopics) {
              //             console.log("ggggg", fields);
              //             return fields;
              //         }
              //     }
              // });
              const command = new PutObjectCommand(params);
              let res = await s3.send(command);
              if (res.$metadata.httpStatusCode == 200) {
                const s3URL = await getSignedUrl(s3, command);
                console.log('PDF uploaded to S3:', s3URL);
                console.log('success', s3URL);
                topicItem['attachment_url'] = s3URL;
                topic = topicItem;
                // processedTopics += 1;
                processedAllTopics += 1;
                processedTopicsforChapter++;
                console.log(
                  'procestopics inside upload',
                  allTopics,
                  processedAllTopics,
                  processedAllTopics === allTopics
                );
                if (processedAllTopics === allTopics) {
                  req.body = fields;
                  console.log('lklkklkl', req.body);
                  next();
                  return;
                }
              }
            } catch (error) {
              console.log('eeeeeeeeeerrrrrrror@@@@@@@@@', error);
            }
          } else {
            processedAllTopics += 1;
            processedTopicsforChapter++;
          }
          if (processedAllTopics === allTopics) {
            console.log(
              'procestopics',
              allTopics,
              processedAllTopics,
              processedAllTopics === allTopics
            );
            req.body = fields;
            console.log('lklkklkl', req.body);
            next();
            return;
          }
        }
        if (
          processedAllChapters !== null &&
          processedTopicsforChapter === item.topics.length
        ) {
          console.log('here');
          processedAllChapters++;
        }
      } else {
        if (processedAllChapters !== null) {
          processedAllChapters++;
        }
      }

      if (allChapters === processedAllChapters) {
        console.log(
          'proceschapters',
          allChapters,
          processedAllChapters,
          allChapters === processedAllChapters
        );
        req.body = fields;
        next();
        return;
      }
    }
  } else if (type === 'topics') {
    for (let i of fields[type] as any[]) {
      const item: any = i;
      // console.log('ttttttt', item, !Object.keys(item).includes('id'));
      if (!('id' in item) && !('topic_link' in item)) {
        try {
          const file: any = files[`topics[${fields.topics.indexOf(i)}][file]`];
          console.log('rrrrrrrr', typeof file, file);
          const fileKey = file['originalFilename'];
          const fileStream = fs.createReadStream(file['filepath']);
          const params = {
            Bucket: AWS_BUCKET,
            Key: fileKey,
            Body: fileStream,
            ContentType: file['mimetype'],
          };
          const command = new PutObjectCommand(params);
          let res = await s3.send(command);
          if (res.$metadata.httpStatusCode == 200) {
            const s3URL = await getSignedUrl(s3, command);
            console.log('success', s3URL);
            item['attachment_url'] = s3URL;
            i = item;
            // processedTopics += 1;
            processedAllTopics += 1;
            if (processedAllTopics === allTopics) {
              req.body = fields;
              console.log('lklkklkl', req.body);
              next();
              return;
            }
            // console.log("topiccccccccccccc", i, processedTopics);
            // if (processedTopics === totalTopics) {
            //     // All topics have been processed, pass updated topics to next handler
            //     // req.body = fields;
            //     // console.log("lklkklkl", req.body);
            //     // next();
            //     req.body = fields;
            //     console.log("lklkklkl", req.body);
            //     next();
            // }
          }
        } catch (error) {
          console.log('eeeeeeeeeerrrrrrror@@@@@@@@@', error);
        }
      } else {
        processedAllTopics += 1;
      }

      if (processedAllTopics === allTopics) {
        req.body = fields;
        console.log('lklkklkl', req.body);
        next();
        return;
      }
    }
  }
};

const generateTopicUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  

  form1.parse(req, async (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    // req.body = fields;
    // next();
    // return;
    console.log('fields,files:::::123', fields, files);
    if (files.cover_image) {
      const file: any = files.cover_image;
      const fileKey =`${fields.title}${file['originalFilename']}`;
      const fileStream = fs.createReadStream(file['filepath']);
      const params = {
        Bucket: AWS_BUCKET,
        Key: fileKey,
        Body: fileStream,
        ContentType: file['mimetype'],
      };
      const command = new PutObjectCommand(params);
      let res = await s3.send(command);
      if (res.$metadata.httpStatusCode == 200) {
        // const s3URL = await getSignedUrl(s3, command);
        // console.log('success', s3URL);
        fields.image_url = fileKey;
        delete files.cover_image;
        delete fields.cover_image;
        console.log('fields after merge', fields);

        if (fields.topics) {
          console.log('in topics');
          // const totalTopics = (fields.topics as string[]).filter((x) => !Object.keys(x).includes('id')).length;
          // const processedTopics = 0;
          const allTopics = (fields.topics as string[]).length;
          const processedAllTopics = 0;
          await getUrl(
            req,
            next,
            'topics',
            allTopics,
            processedAllTopics,
            files,
            fields,
            null,
            null
          );
        } else if (fields.chapters) {
          console.log('in chapters');
          let totalchapters = 0;
          let allTopics = 0;
          const processedAllTopics = 0;
          (fields.chapters as any[]).forEach((chapter) => {
            if (!('id' in chapter)) {
              (chapter.topics as any[]).forEach((topic) => {
                // if (!('id' in topic)) {
                //     allTopics++;
                // }
                allTopics++;
              });
            }
            totalchapters++;
          });
          const processedchapters = 0;
          try {
            getUrl(
              req,
              next,
              'chapters',
              allTopics,
              processedAllTopics,
              files,
              fields,
              totalchapters,
              processedchapters
            );
          } catch (error) {
            console.log('zzzzzzzzzz', error);
          }
        } else {
          req.body = fields;
          next();
          return;
        }
      }

      // s3.upload(params, function (err: any, data: any) {
      //     if (err) {
      //         console.log('////////////', err);
      //     }
      //     if (data) {
      //         console.log('success', data);
      //         fields.image_url = data.Location;
      //         delete files.cover_image;
      //         delete fields.cover_image;
      //         console.log("fields after merge", fields);
      //     }
      // });
    } else {
      if (fields.topics) {
        console.log('in topics');
        const allTopics = (fields.topics as string[]).length;
        const processedAllTopics = 0;
        const totalTopics = (fields.topics as string[]).filter(
          (x) => !Object.keys(x).includes('id')
        ).length;
        const processedTopics = 0;
        getUrl(
          req,
          next,
          'topics',
          allTopics,
          processedAllTopics,
          files,
          fields,
          null,
          null
        );
        // req.body = finalFields;
        // console.log("rrrr", req.body);
        // next();
      } else {
        req.body = fields;
        next();
        return;
      }
    }
  });
};

export default generateTopicUrl;
