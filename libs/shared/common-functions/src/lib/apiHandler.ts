import axios from 'axios';

export function apiRequestHandlerWithTransaction(
  path,
  token,
  method = 'GET',
  data,
  isFormData = false,
  transaction = null
) {
  const accessToken = token ?? undefined;
  const headers = {
    'Content-Type': isFormData
      ? 'application/x-www-form-urlencoded'
      : 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };

  const options = {
    url: `${path}`,
    method: method,
    headers: headers,
    data: data ? data : undefined,
  };

  return axios(options)
    .then((response) => {
      // console.log("rrrrrrrreeeeeeeeeeuuuuuuuuuuuuu", response);
      if (response && response.data && response.data.body) {
        return response?.data?.body;
      } else {
        console.log('responsedata', response.data);
        return response?.data?.data;
      }
    })
    .then((response) => {
      console.log('rtrtrrrrrrr', response);
      return response;
    })
    .catch((error) => {
      console.log('axiosError', error);
      // throw new HttpException(
      //   error?.response?.status,
      //   error?.response?.message
      // );
    });
}

export function apiRequestHandler(
  path,
  token,
  method = 'GET',
  data,
  isFormData = false
) {
  console.log(path, data, '///////////////////');
  const accesstoken = token ?? undefined;
  return axios({
    url: `${path}`,
    method: method,
    headers: {
      'Content-Type': isFormData
        ? 'application/x-www-form-urlencoded'
        : 'application/json',
      Authorization: `Bearer ${accesstoken}`,
    },
    data: data ? data : undefined,
  })
    .then((response) => {
      // console.log("rrrrrrrreeeeeeeeeeuuuuuuuuuuuuu", response);
      if (response && response.data && response.data.body) {
        // console.log("responsebody", response.data.body);
        return response?.data?.body;
      } else {
        // console.log('responsedata', response.data);
        return response?.data?.data;
      }
    })
    .then((response) => {
      // console.log("rtrtrrrrrrr", response);
      // if (response.status === 'error') {
      //   // Automatically signout user if accessToken is no longer valid
      //   // if (response.code === 'auth/invalid-user-token') {
      //   //   supabase.auth.signOut();
      //   // }
      //   throw new CustomError(response.code, response.message);
      // } else {
      return response;
      //}
    })
    .catch((error) => {
      console.log('axiosError', error);
      return error?.response?.message;

      // throw new CustomError(error.response.data.status, error.response.data.message);
      // throw new CustomError(error.response.status, error.response.data.message);
      // console.log("******************************************",error)
      // return error?.response?.data?.message;
    });
}
