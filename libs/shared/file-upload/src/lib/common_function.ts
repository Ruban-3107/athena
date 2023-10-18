import * as fs from 'fs';
import {
    S3Client,
    CreateBucketCommand,
    PutObjectCommand,
    HeadBucketCommand,
    GetObjectCommand,
  } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY, AWS_BUCKET, AWS_ENDPOINT, UNOSERVER_URL } from '../../../config/index';
import axios from 'axios';
const path = require('path');
const FormData = require('form-data');
import { HttpException } from '@athena/shared/exceptions';

const s3 = new S3Client({
  endpoint: AWS_ENDPOINT,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
    forcePathStyle: true //needed with minlo
});


export const generateTopicUrl = async (files, fields, key) => {
    if (files.file) {
        console.log("topic link ");
        const file = files.file;
      const fileKey = `${ fields.title }${ file['originalFilename']}`;
        const fileStream = fs.createReadStream(file['filepath']);
        const params = {
            Bucket: AWS_BUCKET,
            Key: fileKey,
            Body: fileStream,
            ContentType: file['mimetype'],
        };
        console.log("after params");
        const command = new PutObjectCommand(params);
      let res = await s3.send(command);
      console.log("responssssssssssssssssseeeeeeeeeeeeeeeeee",res, fileKey);
      
      // if (res.$metadata.httpStatusCode == 200) {
            // const s3URL = await getSignedUrl(s3, new GetObjectCommand({
            //   Bucket: AWS_BUCKET,
            //   Key: fileKey
            // }), { expiresIn: 7200 });
            // fields.attachment_url = s3URL;
            fields.s3_bucket_filekey = fileKey;
            console.log("fields after mergeeeeeekkkkkjjkkkk", fields);
            return fields;
          // }

    }else{
      return fields;
    }
};

export const getcallfroms3 = async (fileKey) => {
  if (fileKey) {
    // console.log("fileeeeeekeeyeyyy", fileKey);
      const s3url = await getSignedUrl(s3, new GetObjectCommand({
          Bucket: AWS_BUCKET,
          Key: fileKey
      }), { expiresIn: 10900 });
      // console.log("filekeyyyurllllll",s3url);
      return s3url;
  } else {
    fileKey;
  }
}

export const uploadFileUrl = async (files, fields, key) => {
  if (files.file) {
      try {
        console.log("upload fileeeeeeeesss",fields);
      const file = files.file;
      const fileKey = file['originalFilename'];
      const fileStream = fs.createReadStream(file['filepath']);
      const params = {
          Bucket: AWS_BUCKET,
          Key: fileKey,
          Body: fileStream,
          ContentType: file['mimetype'],
      };
      console.log("paramssssssssssss");
      const command = new PutObjectCommand(params);
        let res = await s3.send(command);
        
      if (res.$metadata.httpStatusCode == 200)  {
          // const s3URL = await getSignedUrl(s3, new GetObjectCommand({
          //   Bucket: AWS_BUCKET,
          //   Key: fileKey
          // }), { expiresIn: 7200 });
        console.log("fields after merge", fileKey);
        return fileKey
        // if (s3URL) {
        //   return true;
        // } else {
        //   return false;
        // }
    }
      } catch (error) {
        console.log("rrrrr", error);
        return false;
      }
  }
};


// export const convertToPDF = async (urlToConvert) => {

//   const browser = await chromium.launch();
//   const context = await browser.newContext();
//   const page = await context.newPage();
//   try {
//     console.log("attachmenturl", urlToConvert);

//     const fileResponse = await axios.get(urlToConvert, { responseType: 'arraybuffer' });
//     const fileBuffer = Buffer.from(fileResponse.data, 'binary');

//     await page.setContent(fileBuffer.toString());
//     const pdfBuffer = await page.pdf({ format: 'A4' });
//     console.log("kkkkkklllllllll", pdfBuffer);
//     if (pdfBuffer) {
//       const s3 = new S3Client({
//         endpoint: AWS_ENDPOINT,
//         credentials: {
//           accessKeyId: AWS_ACCESS_KEY_ID,
//           secretAccessKey:AWS_SECRET_ACCESS_KEY,
//         },
//         forcePathStyle: true, // needed with minio?
//         // signatureVersion: 'v4',
//         // sslEnabled: false,
//         region: AWS_REGION,

//       })

//       const pdfFileName = 'converted.pdf';
//       const fileKey = `pdfs/${pdfFileName}`;
//       const uploadParams = {
//         Bucket: AWS_BUCKET,
//         Key: fileKey,
//         Body: pdfBuffer,
//       };
//       const command = new PutObjectCommand(uploadParams);
//       const res = await s3.send(command);
//       if (res.$metadata.httpStatusCode == 200) {
//         const s3URL = await getSignedUrl(s3, new GetObjectCommand({
//           Bucket: AWS_BUCKET,
//           Key: fileKey
//         }), { expiresIn: 7200 });
//         // topicData.attachment_pdf_url = s3URL;
//         return s3URL;
//       }
//     }
//   } catch (error) {

//   }
// }

export const convertToPDF = async (filekey) => {
  if (filekey !== null) {
    try {
      console.log("attachmenturllllllllllll", filekey);
      let pdfBuffer;
      const urlToConvert = await getcallfroms3(filekey);
      const extension = path.extname(urlToConvert).toLowerCase();
      console.log("xtensssssioooooo", extension);
      let localFilePath;
      if (extension === '.pptx') {
        console.log("pptx blooooock");
        localFilePath = './temp/file.pptx';
      } else {
        console.log("docx blooooock")
        localFilePath = './temp/file.docx';
      }
      try {
        // converting the docx or pptx to pdf file
        await downloadFileFromURL(urlToConvert, localFilePath)
          .then(async () => {
            // Use the downloaded file in the file converter
            console.log("urlrrrrrrrrrrrrrrrrr", urlToConvert);
            let data = new FormData();
            data.append('file', fs.createReadStream(localFilePath));
            data.append('format', extension.slice(1)); // Remove the leading dot from the extension
  
            let config = {
              method: 'post',
              maxBodyLength: Infinity,
              url: `${UNOSERVER_URL}/convert/pdf`,
              headers: {
                ...data.getHeaders()
              },
              data: data
            };
  
            await axios.request(config)
              .then((response) => {
                // console.log("/////////////////////////", JSON.stringify(response.data));
                pdfBuffer = response.data;
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log("error:", error);
            throw new HttpException(400, 'error in pdf conversion');
          });
      } catch (error) {
        console.log("error:", error);
        throw new HttpException(400, 'error in pdf convertion');
      }
      // Download the file from the S3 URL to local file system
  
      if (pdfBuffer) {
        const pdfFileName = 'converted.pdf';
        const fileKey = `pdfs/${pdfFileName}`;
        const uploadParams = {
          Bucket: AWS_BUCKET,
          Key: fileKey,
          Body: pdfBuffer,
        };
        const command = new PutObjectCommand(uploadParams);
        const res = await s3.send(command);
        if (res.$metadata.httpStatusCode == 200) {
          // const s3URL = await getSignedUrl(s3, new GetObjectCommand({
          //   Bucket: AWS_BUCKET,
          //   Key: fileKey
          // }), { expiresIn: 7200 });
          return fileKey;
        }
      }
  
    } catch (error) {
      console.log("errorrrrr::", error);
      throw new HttpException(400, 'error in pdf convertion');
    }
  } else {
    return filekey;
  }
 
}


/** Function to download the file from a attachment-URL*/
// const downloadFileFromURL = (fileURL, localFilePath) => {
//   console.log("fileurllrlrlrlrlrlrlrl",fileURL);
  
//   return axios({
//     url: fileURL,
//     method: 'GET',
//     responseType: 'stream'
//   })
//     .then((response) => {
//       console.log("downloadFileeeeekkkkkkkkkkkkkkk");
//       return new Promise((resolve, reject) => {
//         const file = fs.createWriteStream(localFilePath);
//         response.data.pipe(file);
//         file.on('finish', () => {
//           file.close();
//           resolve(file);
//         });
//         file.on('error', (error) => {
//           reject(error);
//         });
//       });
//     })
//     .catch((error) => {
//       console.log("errrrorrrrrrrrrrrrrrrr", error);
//       throw error;
//     });
// };


const downloadFileFromURL = async (fileURL, localFilePath) => {
  try {
    const response = await axios.get(fileURL, { responseType: 'arraybuffer' });
    fs.writeFileSync(localFilePath, response.data);
    console.log('File downloaded successfully:', localFilePath);
    return localFilePath;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};


// const urlToConvert = 'https://example.com/your-file.docx';
// const localFilePath = './your-file.docx';
// let pdfBuffer;

// try {
//   const downloadedFilePath = await downloadFileFromURL(urlToConvert, localFilePath);
  
//   // Use the downloaded file in the file converter
//   const data = new FormData();
//   data.append('file', fs.createReadStream(downloadedFilePath));
//   data.append('format', 'pdf');

//   const config = {
//     method: 'post',
//     maxBodyLength: Infinity,
//     url: `${UNOSERVER_URL}/convert/pdf`,
//     headers: {
//       ...data.getHeaders()
//     },
//     data: data
//   };

//   try {
//     const response = await axios.request(config);
//     pdfBuffer = response.data;
//   } catch (error) {
//     console.log(error);
//     throw new HttpException(400, 'Error in PDF conversion');
//   }
// } catch (error) {
//   console.log(error);
//   throw new HttpException(400, 'Error in file download');
// }
