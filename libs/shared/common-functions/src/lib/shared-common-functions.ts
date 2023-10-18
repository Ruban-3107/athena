export function sharedCommonFunctions(): string {
  return 'shared-common-functions';
}

let transaction = null;
export const getTransaction = () => transaction
export const setTransaction = (t) => { transaction = t; }

import axios from 'axios';
import moment from 'moment';
/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (
    value !== null &&
    typeof value === 'object' &&
    !Object.keys(value).length
  ) {
    return true;
  } else {
    return false;
  }
};

export const customSplit = (
  string: string,
  delimiter: string,
  position?: number
): any => {
  const parts = string.split(delimiter);
  if (typeof position === 'number') {
    return parts[position];
  }
  return parts;
};

export const replaceSpecialCharacters = (
  string: string,
  delimiter: string
): string => {
  return string.replace(/[^A-Za-z0-9]/g, delimiter);
};

export const capitalizeEachWord = (string: string): string => {
  return string.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
    letter.toUpperCase()
  );
};

export const getUrlContent = async (url: string, name?: string | null) => {
  name = name || 'data';
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios(url);
      if (response.status === 200) {
        resolve({ [name]: response.data });
      } else {
        resolve({ [name]: null });
      }
    } catch (error) {
      resolve({ [name]: null });
    }
  });
};

export const pluck = (array, parent, key) => {
  return Array.from(new Set(array.map((obj) => obj[parent][key])));
};

export const sorted = (obj) =>
  Object.keys(obj)
    .sort()
    .reduce((accumulator, key) => {
      accumulator[key] = obj[key];

      return accumulator;
    }, {});

export const generateString = (length) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export const groupByKey = (list, key) =>
  list.reduce(
    (hash, obj) => ({
      ...hash,
      [obj[key]]: (hash[obj[key]] || []).concat(obj),
    }),
    {}
  );

// export const getPagination = (page, size, total) => {
//   const limit = size ? +size : total;
//   //const offset = page && ((page * limit) > total ? total : page * limit);
//   const offset =
//     page == 1 || page == 0
//       ? 0
//       : page * size > total
//       ? size
//       : -(page * size - total);

//   return { limit, offset };
// };

// /**
//  * 200089 Computes the limit and offset values for pagination based on the given page, size, and total number of items.
//  *
//  * @param {number} page - The current page number (1-indexed).
//  * @param {number} size - The maximum number of items to return per page.
//  * @param {number} total - The total number of items in the data set.
//  * @returns {Object} An object containing the limit and offset values.
//  */
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

/**
 * Computes the limit and offset values for pagination based on the given page, size, and total number of items.
 *
 * @param {number} page - The current page number (1-indexed).
 * @param {number} size - The maximum number of items to return per page.
 * @param {number} total - The total number of items in the data set.
 * @returns {Object} An object containing the limit and offset values.
 */
export const getPagination = (page, size, total) => {
  // If size is provided, use it as the limit. Otherwise, use the total number of items.
  const limit = size ? +size : total;

  // Calculate the offset based on the current page and the limit.
  const offset = (page - 1) * size;

  // If the offset is negative or greater than the total number of items, set it to 0 or the last page offset.
  if (offset < 0) {
    return { limit, offset: 0 };
  } else if (offset >= total) {
    return { limit, offset: Math.floor((total - 1) / size) * size };
  }

  // Return an object containing the limit and offset values.
  return { limit, offset };
};

/**Commented just in case*/
// export const getPagingData = (data, page, limit) => {
//   const { count: totalItems, rows } = data;
//   const currentPage = page ? +page : 0;
//   const totalPages = Math.ceil(totalItems / limit);

//   return { totalItems, rows, totalPages, currentPage };
// };

export const getPagingData = (data, page, limit, total = null) => {
  //const { rows, count, totalItems } = data;
  const { rows } = data;
  const totalItems = total;
  const totalItemsPerPage = rows.length;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, totalItemsPerPage, rows, totalPages, currentPage };
};

// convert the numbers into numeric - abbrevation
// eg : nFormatter(1000) => 10K
// eg : nFormatter(1200) => 1.2K
// eg : nFormatter(1000000) => 1M
export function nFormatter(num: number): string {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e7, symbol: 'B' },
  ];

  const numToCheck = Math.abs(num);
  for (let i = lookup.length - 1; i >= 0; i--) {
    if (numToCheck >= lookup[i].value) {
      const newNumber = (num / lookup[i].value).toFixed(1);
      return `${newNumber}${lookup[i].symbol}`.replace('.0', '');
    }
  }
  return '0';
}

export function getInterval(dateRange: string) {
  switch (dateRange) {
    case 'year':
      return 'day';
    case 'month':
      return 'day';
    default:
      return 'day';
  }
}

export function getDaysObject(days: number) {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const fromDate = new Date();
  fromDate.setDate(today.getDate() - days);
  fromDate.setHours(0, 0, 0, 0);
  const toDate = new Date();
  toDate.setDate(today.getDate() - days * 2);
  toDate.setHours(0, 0, 0, 0);
  const date = {
    today,
    fromDate,
    toDate,
  };
  return date;
}

export function getDateRange(dateRange: string, currentDate: Date) {
  let n: number;
  let year: number;
  let month: number;
  let daysInMonth: number;

  switch (dateRange) {
    case 'year':
      n = 365;
      break;
    case 'month':
      year = currentDate.getFullYear();
      month = currentDate.getMonth();
      daysInMonth = moment([year, month]).daysInMonth();
      n = daysInMonth - 1;
      break;
    default:
      n = 7;
      break;
  }

  const { fromDate, today } = getDaysObject(n);
  return { fromDate, today };
}

export function getDateArray(fromDate: Date, today: Date) {
  const dateArray: string[] = [];
  let loopDate = fromDate;
  while (loopDate <= today) {
    dateArray.push(moment(loopDate).format('YYYY-MM-DD'));
    loopDate = new Date(loopDate.getTime() + 24 * 60 * 60 * 1000);
  }
  return dateArray;
}

export function mapModelDatatoGraphData(
  dateArray: string[],
  model: any[],
  today: Date
) {
  return dateArray.map((date) => {
    const record = model.find(
      (t) => moment(t.get(`truncLevel`)).format(`YYYY-MM-DD`) === date
    );
    return {
      date,
      total_count: record ? record.get(`total_count`) : 0,
    };
  });
}
/**Calculates learning progress % from the parsed course_summary data object*/
export function calculateLearningProgress(
  data: any[],
  category: string
): {
  category?: string;
  lastTouchedAt?: Date;
  totalChapters: number;
  totalTopics: number;
  completedTopics?: number;
  completedPercentage: number;
} {
  let totalChapters = 0;
  let totalTopics = 0;
  let completedTopics = 0;

  if (category === 'Track') {
    data.forEach((item) => {
      totalChapters += item.chapters.length;

      item.chapters.forEach((chapter) => {
        totalTopics += chapter.topics.length;

        completedTopics += chapter.topics.filter(
          (x) => x.status === 'completed'
        ).length;
      });
    });
  } else if (category === 'Course') {
    data.forEach((chapter) => {
      totalChapters++;
      totalTopics += chapter.topics.length;
      completedTopics += chapter.topics.filter(
           (x) => x.status === 'completed'
      ).length;
    });
  }

  const completedPercentage = (completedTopics / totalTopics) * 100;


  return {
    category,
    totalChapters,
    totalTopics,
    //completedTopics,
    completedPercentage: Math.round(completedPercentage),
  };
}
