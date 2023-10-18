import formidable from 'formidable';
import { NextFunction, Response, Request } from 'express';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';
import { HttpException } from '@athena/shared/exceptions';
const form1 = formidable({ multiples: true });
import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY, AWS_BUCKET, AWS_ENDPOINT, HOST_IP } from '../app/config/index';

const s3 = new S3Client({
  endpoint: AWS_ENDPOINT,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID ?? 'athena-dev-key',
    secretAccessKey: AWS_SECRET_ACCESS_KEY ?? 'aTBaS18Qjb',
  },
  forcePathStyle: true, // needed with minlo
  region: AWS_REGION
});

const getUrl = async (
  req: Request,
  next: NextFunction,
  type: string,
  allTopics: number,
  processedAllTopics: number,
  files: any,
  fields: any,
  allCoverImages: number,
  processedAllCoverImages: number,
  totalChildren: number | null,
  processedchildren: number | null
) => {
  console.log('kkkkkkk', typeof fields[type], fields[type]);

  for (let i of fields[type] as any[]) {
    const item: any = i;
    if (!Object.keys(item).includes('id')) {
      try {
        console.log(
          'jhhhhhhhh',
          fields.children.indexOf(i),
          `children[${fields.children.indexOf(i)}][cover_image]`
        );
        const file: any =
          files[`children[${fields.children.indexOf(i)}][cover_image]`];
        const fileKey = file['originalFilename'];
        const fileStream = fs.createReadStream(file['filepath']);
        const params = {
          Bucket: AWS_BUCKET,
          Key: fileKey,
          Body: fileStream,
          ContentType: file['mimetype'],
        };

        const command = new PutObjectCommand(params);
        const res = await s3.send(command);

        if (res.$metadata.httpStatusCode == 200) {
          const url = await getSignedUrl(s3, command);
          console.log('success', url);
          item['image_url'] = url;
          i = item;
          // processedTopics += 1;
          processedAllCoverImages += 1;
          // processedTopicsforChapter++;
          console.log(
            'procestopics inside upload',
            allTopics,
            processedAllTopics,
            processedAllTopics === allTopics,
            allCoverImages,
            processedAllCoverImages,
            processedAllCoverImages === allCoverImages
          );
          if (
            processedAllTopics === allTopics &&
            processedAllCoverImages === allCoverImages
          ) {
            req.body = fields;
            console.log('ikkada', req.body);
            next();
            return;
          }
          for (const chapter of item.chapters) {
            if (!Object.keys(chapter).includes('id')) {
              console.log('zzzzzzzz', chapter, item.chapters.indexOf(chapter));
              // let newTab;
              // const a = [];
              // for (const item of chapter.topics) {
              //     const replacedItems = Object.keys(item).map((key) => {
              //         const newKey = key.slice(1, -1);;
              //         return { [newKey]: item[key] };
              //     });
              //     newTab = replacedItems.reduce((a, b) => Object.assign({}, a, b));
              //     a.push(newTab);
              // }
              // console.log("poppopo", a);
              // chapter.topics = a;
              for (let topic of chapter.topics as any[]) {
                const topicItem: any = topic;
                const jjjj: any = JSON.parse(JSON.stringify(topic));
                console.log(
                  'lllllllll',
                  typeof topicItem,
                  typeof jjjj,
                  jjjj,
                  topicItem
                );
                if (
                  !Object.keys(topicItem).includes('id') &&
                  !Object.keys(topicItem).includes('topic_link')
                ) {
                  console.log('yyyyyyyy', topic, chapter.topics.indexOf(topic));
                  try {
                    console.log(
                      'jhhhhhhhh',
                      chapter.topics.indexOf(topic),
                      `children[${fields.children.indexOf(
                        i
                      )}][chapters][${item.chapters.indexOf(
                        chapter
                      )}][topics][${chapter.topics.indexOf(topic)}][file]`
                    );
                    const file: any =
                      files[
                      `children[${fields.children.indexOf(
                        i
                      )}][chapters][${item.chapters.indexOf(
                        chapter
                      )}][topics][${chapter.topics.indexOf(topic)}][file]`
                      ];
                    const fileKey = file['originalFilename'];
                    const fileStream = fs.createReadStream(file['filepath']);
                    const params = {
                      Bucket: AWS_BUCKET,
                      Key: fileKey,
                      Body: fileStream,
                      ContentType: file['mimetype'],
                    };

                    const command = new PutObjectCommand(params);
                    const res = await s3.send(command);

                    // .then(data => {
                    if (res.$metadata.httpStatusCode == 200) {
                      const url = await getSignedUrl(s3, command);
                      topicItem['attachment_url'] = url;
                      topic = topicItem;
                      // processedTopics += 1;
                      processedAllTopics += 1;
                      // processedTopicsforChapter++;
                      console.log(
                        'procestopicstopicupl',
                        allTopics,
                        processedAllTopics,
                        processedAllTopics === allTopics,
                        allCoverImages,
                        processedAllCoverImages,
                        processedAllCoverImages === allCoverImages
                      );
                      if (
                        processedAllTopics === allTopics &&
                        processedAllCoverImages === allCoverImages
                      ) {
                        req.body = fields;
                        console.log('lklkklkl', req.body);
                        next();
                        return;
                      }
                    }
                    // console.log("topiccccccccccccc", topic, processedTopics);
                    // if (processedTopics === totalTopics) {
                    //     // All topics have been processed, pass updated chapters to next handler
                    //     delete fields.description;
                    //     req.body = fields;
                    //     console.log("lklkklkl", req.body);
                    //     next();
                    //     // console.log("ggggg", fields);
                    //     // return fields;
                    // }
                    // })
                    // .catch(err => {
                    //     console.error("yuyuyu", err);
                    // });
                  } catch (error) {
                    console.log('eeeeeeeeeerrrrrrror@@@@@@@@@', error);
                    next(error);
                  }
                } else {
                  if (
                    processedAllTopics === allTopics &&
                    processedAllCoverImages === allCoverImages
                  ) {
                    req.body = fields;
                    console.log('lklkklkl', req.body);
                    next();
                    return;
                  }
                }
                // else {
                //     processedAllTopics += 1;
                //     // processedTopicsforChapter++;
                // }
                // if (processedAllTopics === allTopics) {
                //     console.log("procestopics", allTopics, processedAllTopics, processedAllTopics === allTopics)
                //     req.body = fields;
                //     console.log("lklkklkl", req.body);
                //     next();
                // }
              }
              // if (processedAllChapters !== null && processedTopicsforChapter === item.topics.length) {
              //     console.log("here");
              //     processedAllChapters++;
              // }
            }
            // else {
            //     if (processedAllChapters !== null) {
            //         processedAllChapters++;
            //     }
            // }
          }
        }
        // .then(async data => {

        // })
        // .catch(err => {
        //     console.error("yuyuyu", err);
        // });
      } catch (error) {
        console.log('eeeeeeeeeerrrrrrror@@@@@@@@@', error);
        next(error);
      }
      // console.log("ttttrttttt", item, fields.children.indexOf(i));
    } else {
      if (processedchildren !== null) {
        processedchildren++;
      }
    }

    if (totalChildren === processedchildren) {
      req.body = fields;
      next();
      return;
    }
  }
};

const generateTopicUrlForTrack = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  form1.parse(req, async (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    console.log('fields,files:::::123', fields, files);
    if (files.cover_image) {
      const file: any = files.cover_image;
      const fileKey = `${fields.title}${file['originalFilename']}`;
      const fileStream = fs.createReadStream(file['filepath']);
      const params = {
        Bucket: AWS_BUCKET,
        Key: fileKey,
        Body: fileStream,
        ContentType: file['mimetype'],
      };
      const command = new PutObjectCommand(params);
      const res = await s3.send(command);

      // .then(data => {
      if (res.$metadata.httpStatusCode == 200) {
        // const url = await getSignedUrl(s3, command);
        // console.log('success', url);
        fields.image_url = fileKey;
        delete files.cover_image;
        delete fields.cover_image;
        console.log('fields after merge', fields);

        if (fields.children) {
          console.log('in children');
          // let totalchapters = 0;
          let allTopics = 0;
          const processedAllTopics = 0;
          let allCoverImages = 0;
          const processedAllCoverImages = 0;
          const totalchildren: number = (fields.children as any[]).length;
          const processedchildren = 0;

          (fields.children as any[]).forEach((child) => {
            console.log('hhhhhhhjjh', child);
            if (!Object.keys(child).includes('id')) {
              (child.chapters as any[]).forEach((chapter) => {
                if (!Object.keys(chapter).includes('id')) {
                  let newTab;
                  const a: any = [];
                  // for (const item of chapter.topics as any[]) {
                  console.log(
                    'lopop',
                    typeof chapter.topics,
                    Array.isArray(chapter.topics),
                    chapter.topics
                  );
                  (chapter.topics as any[]).forEach((item) => {
                    const replacedItems = Object.keys(item).map((key) => {
                      const newKey = key.slice(1, -1);
                      return { [newKey]: item[key] };
                    });
                    newTab = replacedItems.reduce((a, b) =>
                      Object.assign({}, a, b)
                    );
                    a.push(newTab);
                  });
                  console.log('poppopo', a);
                  chapter.topics = a;
                  (chapter.topics as any[]).forEach((topic) => {
                    if (
                      !Object.keys(topic).includes('id') &&
                      !Object.keys(topic).includes('topic_link')
                    ) {
                      allTopics++;
                    }
                    // allTopics++;
                  });
                }
                // totalchapters++;
              });
              allCoverImages++;
            }
          });

          try {
            getUrl(
              req,
              next,
              'children',
              allTopics,
              processedAllTopics,
              files,
              fields,
              allCoverImages,
              processedAllCoverImages,
              totalchildren,
              processedchildren
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
    }
    else {
      throw new HttpException(400,'please provide a cover image for the track')
    }
  });
};

export default generateTopicUrlForTrack;


