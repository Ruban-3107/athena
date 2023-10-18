import { DateData, DateTrendData } from '../interface/date_data.interface';
import moment from 'moment';
import { ContinueLearning } from '../interface/learner_metrics.interface';

import axios from 'axios';
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

// to compute the average in percentage of an given array
// respective to the {max} value
// eg: values = [2,3,4,5] max=10
// output: 35 in percentage
export function calculatePercentage(
  values: number[],
  max = 5,
  isTrend = false
): number {
  let avg_length = 0;
  let count = 0;
  avg_length = values?.length;
  if (avg_length) {
    count = values.reduce((avg: number, rating: number) => {
      avg += rating / avg_length;
      return avg;
    }, 0);
  }
  if (!isTrend) {
    count = (count / max) * 100;
  }
  return Math.ceil(count);
}

export function convertdatetoepoch(date: Date): number {
  const converteddate = Math.floor(date.getTime() / 1000);
  return converteddate;
}

export function calculateLearningProgress(
  data: any[],
  category: string
): ContinueLearning {
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
