import axios from 'axios';
// import { HttpException } from '../../../../../libs/shared/exceptions/src/index';

export function apiRequest(path, method = 'GET', data, isFormData = false) {
  const userData = JSON.parse(localStorage.getItem('userData'));
  console.log('userssssss', userData);
  const accessToken = userData ? userData.access_token : undefined;
  return axios({
    url: `/${path}`,
    method: method,
    headers: {
      'Content-Type': isFormData
        ? 'application/x-www-form-urlencoded'
        : 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    data: data ? data : undefined,
  })
    .then((response) => {
      console.log("zzzzzzzzzzz", response);
      if (response && response.data && response.data.body) {
        // console.log("responsebody",response.data.body);
        return response?.data?.body;
      } else {
        // console.log("responsedata",response.data);
        return response?.data?.data;
      }
    })
    .then((response) => {
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
      // console.log("axiosError", error.response.status, error.response.data.message, error);
      console.log("axioserror", error, error?.response);
      return error?.response?.message ?? error?.message;

      // throw new CustomError(error.response.data.status, error.response.data.message);
      // throw new CustomError(error.response.status, error.response.data.message);
      // console.log("******************************************",error)
      // return error?.response?.data?.message;
    });
}



export function apiRequestHandler(path, token, method = 'GET', data, isFormData = false) {
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
      console.log("rrrrrrrreeeeeeeeeeuuuuuuuuuuuuu", response);
      if (response && response.data && response.data.body) {
        // console.log("responsebody", response.data.body);
        return response?.data?.body;
      } else {
        // console.log("responsedata", response.data);
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
      console.log("axiosError", error);
      return error?.response?.message;

      // throw new CustomError(error.response.data.status, error.response.data.message);
      // throw new CustomError(error.response.status, error.response.data.message);
      // console.log("******************************************",error)
      // return error?.response?.data?.message;
    });
}

export function apiRequestHandlerWithTransaction(path, token, method = 'GET', data, isFormData = false, transaction) {
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
    // ...(transaction && { transaction }),
  };

  return axios(options)
    .then((response) => {
      // console.log("rrrrrrrreeeeeeeeeeuuuuuuuuuuuuu", response);
      if (response && response.data && response.data.body) {
        return response?.data?.body;
      } else {
        // console.log("responsedata", response.data);
        return response?.data?.data;
      }
    })
    .then((response) => {
      // console.log("rtrtrrrrrrr", response);
      return response;
    })
    .catch((error) => {
      console.log("axiosError", error);
      // throw new HttpException(
      //   error?.response?.status,
      //   error?.response?.message
      // );
    });
}

// Create an Error with custom message and code
// export function CustomError(code, message) {
//   const error = new Error(message);
//   error.code = code;
//   return error;
// }

// import { supabase } from './supabaseClient';
// import {
//   Publishing,
//   Building,
//   Mentoring,
//   Authoring,
//   Maintaining,
// } from '@athena/web-shared/ui';
// import axios from 'axios';

// export function apiRequest(path, method = 'GET', data, isFormData = false) {
//   const session = supabase.auth.session();
//   console.log(session,"session");
//   const accessToken = session ? session.access_token : undefined;
//   // console.log("////////////////", path, method, data, isFormData, accessToken);

//   return axios({
//     url: `/${path}`,
//     method: method,
//     headers: {
//       'Content-Type': isFormData
//         ? 'application/x-www-form-urlencoded'
//         : 'application/json',
//       Authorization: `Bearer ${accessToken}`,
//       CHECK_WITH_CUSTOM_USER: false,
//     },
//     data: data ? data : undefined
//   })
//     .then((response) =>
//       response?.data)
//     .then((response) => {
//       // console.log("**********************************************3333",response)
//       if (response.status === 'error') {
//         // Automatically signout user if accessToken is no longer valid
//         if (response.code === 'auth/invalid-user-token') {
//           supabase.auth.signOut();
//         }
//         throw new CustomError(response.code, response.message);
//       } else {
//         return response.data;
//       }
//     })
//     .catch((error) => {
//       // console.log("axiosError", error.response.status, error.response.data.message, error);
//       return error?.response?.data;

//       // throw new CustomError(error.response.data.status, error.response.data.message);
//       // throw new CustomError(error.response.status, error.response.data.message);
//       // console.log("******************************************",error)
//       // return error?.response?.data?.message;

//     });
// }

// // Create an Error with custom message and code
// export function CustomError(code, message) {
//   const error = new Error(message);
//   error.code = code;
//   return error;
// }

// export const contributions_data = {
//   publishing: {
//     title: 'Publishing',
//     subtitle: 'solutions published',
//     icon: <Publishing />,
//   },
//   mentoring: {
//     title: 'Mentoring',
//     subtitle: 'mentorships completed',
//     icon: <Mentoring />,
//   },
//   authoring: {
//     title: 'Authoring',
//     subtitle: 'articles published',
//     icon: <Authoring />,
//   },
//   building: {
//     title: 'Building',
//     subtitle: 'solutions checked-in',
//     icon: <Building />,
//   },
//   maintaining: {
//     title: 'Maintaining',
//     subtitle: 'PRs merged',
//     icon: <Maintaining />,
//   },
// };

export function isNegative(val) {
  if (val == 0) {
    return false;
  }
  let count = Math.sign(val);
  return count === -1 || count === -0;
}
