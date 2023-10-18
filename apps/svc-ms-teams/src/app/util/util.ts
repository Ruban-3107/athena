import moment from 'moment';
import axios from 'axios';
/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
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

export const groupByKey = (list, key) =>
  list.reduce(
    (hash, obj) => ({
      ...hash,
      [obj[key]]: (hash[obj[key]] || []).concat(obj),
    }),
    {}
  );

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

/**To write your helper functions, business logic*/
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

/**Could be used if we are using search filter in one endpoint itself: Sanjeev */
export const searchRecords = (records: any, keyword: any): Promise<any> => {
  return records.filter((record: any) =>
    Object.values(record).some(
      (value) => value && value.toString().toLowerCase().includes(keyword)
    )
  );
};

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

export function mapUsersToGraphData(
  coursesCompleted: { date: string; total_count: number }[],
  dateRange: string,
  today: Date
) {
  if (dateRange === 'week' || dateRange === 'month') {
    return coursesCompleted.map((course) => {
      const graphLabel =
        moment(course.date).format('YYYY MMM DD') ===
        moment(today).format('YYYY MMM DD')
          ? 'today'
          : moment(course.date).format('MMM DD');
      return {
        graphLabel,
        type: 'users_data',
        count: course.total_count.toString(),
      };
    });
  } else if (dateRange === 'year') {
    // Group results by month and sum up counts for each month
    const monthlyCounts = coursesCompleted.reduce((acc, course) => {
      const month = moment(course.date).format('MMM');
      if (acc[month]) {
        acc[month] += Number(course.total_count);
      } else {
        acc[month] = Number(course.total_count);
      }
      return acc;
    }, {});

    // Check if any dates are in the current month
    const currentMonth = moment(today).format('MMM');
    let graphLabel = currentMonth;
    if (Object.keys(monthlyCounts).includes(currentMonth)) {
      graphLabel = 'this month';
    }

    // Map results to graph data
    return Object.entries(monthlyCounts)
      .map(([month, count]) => ({
        graphLabel: month,
        type: 'users_data',
        count: count.toString(),
      }))
      .concat({
        graphLabel,
        type: 'users_data',
        count: monthlyCounts[currentMonth]
          ? monthlyCounts[currentMonth].toString()
          : '0',
      });
  } else {
    return [];
  }
}

