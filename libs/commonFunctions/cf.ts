export const getPagination = (page, size, total) => {
    const limit = size ? +size : total;
    //const offset = page && ((page * limit) > total ? total : page * limit);
    const offset = (page == 1) ? 0 : ((page * size) > total ? size : -((page * size) - total))
  
    return { limit, offset };
  };
  
  export const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, rows, totalPages, currentPage };
  };
  
  
  let transaction = null;
  export const getTransaction = () => transaction
  export const setTransaction = (t) => { transaction = t; }
  // module.exports = {
  //   getTransaction: () => transaction,
  //   setTransaction: (t) => { transaction = t; },
  // };