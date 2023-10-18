import * as fs from 'fs';
import * as formidable from 'formidable';

export const parseRequestFiles = async (req) => {
  const form = new formidable.IncomingForm();
  return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
       
        if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
};
// export const parseRequestFiles = async (req) => {
//   const form = new formidable.IncomingForm();
//   return new Promise((resolve, reject) => {
//       form.parse(req, (err, fields, files) => {
       
//         if (err) {
//         reject(err);
//       } else {
//         resolve({ fields, files });
//       }
//     });
//   });
// };


export const parseRequestFilesUpload = async (req) => {
  const form = new formidable.IncomingForm();
  console.log("req-----",req.path,"--fillleee");
  const fileStream:any = fs.createReadStream(req.file.buffer);

  return new Promise((resolve, reject) => {
    form.parse(fileStream, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
};

// export const parseRequestFilesUpload = async (req) => {
//   const form = new formidable.IncomingForm();
//   console.log("req-----",req.path,"--fillleee");
//   const fileStream = fs.createReadStream(req.file.buffer);

//   return new Promise((resolve, reject) => {
//     form.parse(fileStream, (err, fields, files) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve({ fields, files });
//       }
//     });
//   });
// };
