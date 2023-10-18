// const axios = require('axios');
// /**
//  * @method isEmpty
//  * @param {String | Number | Object} value
//  * @returns {Boolean} true & false
//  * @description this value is Empty Check
//  */
// export const isEmpty = (value: string | number | object): boolean => {
//   if (value === null) {
//     return true;
//   } else if (typeof value !== 'number' && value === '') {
//     return true;
//   } else if (typeof value === 'undefined' || value === undefined) {
//     return true;
//   } else if (
//     value !== null &&
//     typeof value === 'object' &&
//     !Object.keys(value).length
//   ) {
//     return true;
//   } else {
//     return false;
//   }
// };

// export const customSplit = (
//   string: string,
//   delimiter: string,
//   position?: number
// ): any => {
//   let parts = string.split(delimiter);
//   if (typeof position === 'number') {
//     return parts[position];
//   }
//   return parts;
// };

// export const replaceSpecialCharacters = (
//   string: string,
//   delimiter: string
// ): string => {
//   return string.replace(/[^A-Za-z0-9]/g, delimiter);
// };

// export const capitalizeEachWord = (string: string): string => {
//   return string.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
//     letter.toUpperCase()
//   );
// };

// export const getUrlContent = async (url: string, name?: string | null) => {
//   name = name || 'data';
//   return new Promise(async (resolve, reject) => {
//     try {
//       let response = await axios(url);
//       if (response.status === 200) {
//         resolve({ [name]: response.data });
//       } else {
//         resolve({ [name]: null });
//       }
//     } catch (error) {
//       resolve({ [name]: null });
//     }
//   });
// };

// export const pluck = (array, parent, key) => {
//   return Array.from(new Set(array.map((obj) => obj[parent][key])));
// };

// export const sorted = (obj) =>
//   Object.keys(obj)
//     .sort()
//     .reduce((accumulator, key) => {
//       accumulator[key] = obj[key];

//       return accumulator;
//     }, {});

// export const generateString = (length) => {
//   let result = '';
//   const characters =
//     'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   const charactersLength = characters.length;
//   for (let i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//   }

//   return result;
// };

// export const getPagination = (page, size, total) => {
//   // If size is provided, use it as the limit. Otherwise, use the total number of items.
//   const limit = size ? +size : total;

//   // Calculate the offset based on the current page and the limit.
//   const offset =
//     page === 1 || page === 0 // If we're on the first page, the offset is 0.
//       ? 0
//       : page * size > total // If the current page is beyond the last page, set the offset to the last page.
//       ? size
//       : -(page * size - total); // Otherwise, calculate the offset based on the current page and the limit.

//   // Return an object containing the limit and offset values.
//   return { limit, offset };
// };

// export const getPagingData = (data, page, limit, total = null) => {
//   const { rows } = data;
//   const totalItems = total;
//   const totalItemsPerPage = rows.length;
//   const currentPage = page ? +page : 0;
//   const totalPages = Math.ceil(totalItems / limit);
//   return { totalItems, totalItemsPerPage, rows, totalPages, currentPage };
// };

// /**Sanjeev: I have commented this function in case it's affecting many other modules*/
// // export const getPagingData = (data, page, limit) => {
// //   const { count: totalItems, rows } = data;
// //   const currentPage = page ? +page : 0;
// //   const totalPages = Math.ceil(totalItems / limit);

// //   return { totalItems, rows, totalPages, currentPage };
// // };

// // export const getPagingData = (data, page, limit) => {
// //   const { rows } = data;
// //   const totalItemsPerPage = rows.length;
// //   const currentPage = page ? +page : 0;
// //   const totalPages = Math.ceil(totalItemsPerPage / limit);
// //   return { totalItemsPerPage, rows, totalPages, currentPage };
// // };

// // export const getPagingData = (data, page, limit, total = null) => {
// //   const { rows } = data;
// //   const totalItems = total;
// //   const totalItemsPerPage = rows.length;
// //   const currentPage = page ? +page : 0;
// //   const totalPages = Math.ceil(totalItemsPerPage / limit);
// //   return { totalItems, totalItemsPerPage, rows, totalPages, currentPage };
// // };
