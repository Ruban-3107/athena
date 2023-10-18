// // const { sendMail } = require("../../services/email.service");
// const { generateMailContent, response } = require("../../helpers");
// // const UserEventEmitter = require("../index");
// import { sendMail, sendMailForBulkUploadUsers } from '../../services/email.service'
// import UserEventEmitter from '../index';
// import {HOST_IP}  from '../../config/index'

// UserEventEmitter.on("user_created", async (data, HOSTURL) => {
//   try {
//     console.log("Inside create employee email trigger event: ", data);

//     let employeeObj = {
//       email: data.work_email,
//       subject: "Welcome to BAssure family",
//       mailContent: generateMailContent("welcome_user.js", {
//         employee_name: data.first_name,
//         email: data.work_email,
//         host_url: HOSTURL,
//       }),
//     };
//       return await sendMail(employeeObj);

//   } catch (err) {
//     console.log(`Email not sent to ${data.work_email}`, err);
//   }
// });
// UserEventEmitter.on("new_user_created", async (data) => {
//   console.log("ppppppppppppppppp")
//   try {
//     console.log("Inside create user email trigger events: ", data);
//     let userObj = {
//       email: data.work_email,
//       subject: "Welcome to BAssure family",
//       mailContent: generateMailContent("welcome_new_user.js", {
//         first_name: data.first_name,
//         last_name: data.last_name,
//         email: data.work_email,
//         password: data.password,
//         host_url: `http://${HOST_IP}:4300/auth/signin`
//       }),
//     };

//     console.log("ooooooooooooooooooooooooooooooooooooooooooooooooooo ", userObj);
//     return await sendMail(userObj);
//   } catch (err) {
//     console.log(`Email not sent to ${data.work_email}`, err);
//   }
// });

// UserEventEmitter.on("new_bulk_user_created", async (data) => {
//   console.log("ppppppppppppppppp")
//   try {
//     console.log("Inside create user email trigger events: ", data);
//     let userObj = {
//       email: data.work_email,
//       subject: "Welcome to BAssure family",
//       mailContent: generateMailContent("welcome_new_user.js", {
//         first_name: data.first_name,
//         last_name: data.last_name,
//         email: data.work_email,
//         password: data.password,
//         host_url: `http://${HOST_IP}:4300/auth/signin`
//       }),
//     };

//     console.log("kk ", userObj);
//     return await sendMailForBulkUploadUsers(userObj);
//   } catch (err) {
//     console.log(`Email not sent to ${data.work_email}`, err);
//   }
// });

// UserEventEmitter.on("change_password", async (data) => {
//   try {
//     // console.log("Inside password change email trigger event: ", data);

//     let employeeObj = {
//       email: data.work_email,
//       subject: "Password Change Link",
//       mailContent: generateMailContent("password_change.js", {
//         user_name: data.first_name,
//         host_url: data.url,
//         token:data.token
//       }),
//     };

//       return await sendMail(employeeObj);
//   } catch (err) {
//     console.log(`Email not sent to ${data.work_email}`, err);
//   }
// });



// UserEventEmitter.on("userroles_assigned", async (data) => {
//   try {
//     let a = data.user.roles.map((x) => x.name);
//     a = a.join();
//     let employeeObj = {
//       email: data.work_email,
//       subject: "Roles Assigned",
//       mailContent: generateMailContent("role_assign.js", {
//         employee_name: data.first_name,
//         roles: a,
//       }),
//     };
//     await sendMail(employeeObj);
//   } catch (err) {
//     console.log(err);
//    }
// });
// UserEventEmitter.on("userroles_updated", async (initial, final) => {
//   try {
//     let employeeObj;

//     /**To get the initial array of roles */
//     let a = initial.user.roles.map((x) => x.name).sort();
//     /**Toget the updated array of roles */
//     let b = final.user.roles.map((x) => x.name).sort();

//     /**To check the index of the arrays */
//     let A = parseInt(a.length);
//     /**To check the index of the arrays */
//     let B = parseInt(b.length);

//     /**Unique values in both the arrays will be pushed into this empty array*/
//     let newArr = [];
//     /**unique method in the ../../lib/helpers.js */
//     let uniqueValue = unique(a, b, newArr).flat();

//     /**To set mail content according to the following conditions*/
//     let content;
//     if (uniqueValue === []) {
//       console.log("No need to send email");
//     } else if (A < B) {
//       content = generateMailContent("role_update_add.js", {
//         employee_name: final.first_name,
//         roles: uniqueValue,
//         new_roles: a.flat(),
//       });
//     } else if (A > B) {
//       content = generateMailContent("role_update_delete.js", {
//         employee_name: final.first_name,
//         roles: uniqueValue,
//       });
//     }
//     employeeObj = {
//       email: final.work_email,
//       subject: "Role update",
//       mailContent: content,
//     };
//     if (typeof employeeObj === "object") {
//       await sendMail(employeeObj);
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });

// export default UserEventEmitter;
