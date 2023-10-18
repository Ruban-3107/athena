
import fs = require('fs');

import {
  S3Client,
  CreateBucketCommand,
  PutObjectCommand,
  HeadBucketCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY, AWS_BUCKET, AWS_ENDPOINT} from '../../../config/index';



const s3 = new S3Client({
  endpoint: AWS_ENDPOINT,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true
});

//  const file = 'test_upload/demo-text.js';
//  const fileName = 'demo-text.js';

export const uploadTopic = async (file) => {
  try {
    console.log("filepath getting",file.file.filepath)
    const data = fs.readFileSync(file.file.filepath)
    console.log("data for topc%%%%%%%%", data);
    const uploadParams = {
      Bucket: AWS_BUCKET,
      Key: `${file.file.filepath}/${file.file.originalFilename}`,
      Body: data,
    };

    const command=new PutObjectCommand(uploadParams)
        const res=await s3.send(command)
        
        // console.log("url:::::::::::::",url)
        if(res.$metadata.httpStatusCode==200){
          const url= await getSignedUrl(s3,new GetObjectCommand({
            Bucket: AWS_BUCKET,
            Key: `${file.file.filepath}/${file.file.originalFilename}`
          }), { expiresIn: 7200 })
          return({ success: true, url: url })
        }else{
          return ({success: false, message: "File upload error"})
        }
  } catch (error) {
    console.log('Something went wrong.', error);
  }
}

export const uploadFile = async (file, Allowed_types) => {
  try {
    // console.log("::::::::::::::::::::::", Allowed_types);
    // console.log("?/////////", file?.certificate_upload?.mimetype);
    if (Allowed_types.includes(file?.certificate_upload?.mimetype)) {
      const data = fs.readFileSync(file?.certificate_upload?.filepath );
      const uploadParams = {
        Bucket: AWS_BUCKET,
        Key: `${file.certificate_upload.filepath}/${file.certificate_upload.originalFilename}`,
        Body: data,
      };
      const command=new PutObjectCommand(uploadParams)
      const res=await s3.send(command)
      
      if (res.$metadata.httpStatusCode == 200) {
        const url= await getSignedUrl(s3,new GetObjectCommand({
          Bucket: AWS_BUCKET,
          Key: `${file.certificate_upload.filepath}/${file.certificate_upload.originalFilename}`
        }), { expiresIn: 7200 })
        return({ success: true, url: url })
      }else{
        return ({success: false, message: "File upload error"})
      }
    } else {
      return { success: false, message: "Please check file type" };
    }
  } catch (error) {
    console.log('Something went wrong.', error);
  }

}

