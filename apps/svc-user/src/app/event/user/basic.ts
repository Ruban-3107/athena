// const { sendMail } = require("../../services/email.service");
import { generateMailContent } from '../../helpers';
// const UserEventEmitter = require("../index");
import { sendMail } from '../../service/email.service';
import UserEventEmitter from '../index';
import { HOST_IP, HOST_IP_FRONT } from '../../config/index';
import { MessageSchema } from '../../util/messageSchema';
import { MessageQueue } from '../../util/message.queue';



UserEventEmitter.on('user_created', async (data, HOSTURL) => {
  try {
    console.log('Inside create employee email trigger event: ', data);
    const employeeObj = {
      contact: data.work_email,
      templateName: 'welcome_user',
      employee_name:
        data.first_name.charAt(0).toUpperCase() + data.first_name.slice(1),
      host_url: HOSTURL,
    };

    const messageSchema = new MessageSchema(employeeObj);
    const message = await messageSchema.getSchema();
    const messageQueue = new MessageQueue();
    return await messageQueue.send(message);

    // const employeeObj = {
    //   email: data.work_email,
    //   subject: 'Welcome to BAssure family',
    //   mailContent: generateMailContent('welcome_user.js', {
    //     employee_name: data.first_name,
    //     email: data.work_email,
    //     host_url: HOSTURL,
    //   }),
    // };
    // console.log('sendMail called:::::::::', employeeObj);
    // return await sendMail(employeeObj);
  } catch (err) {
    console.log(`Email not sent to ${data.work_email}`, err);
  }
});

UserEventEmitter.on('new_user_created', async (data) => {
  try {
    console.log('Inside create new user email trigger event: ', data);

    // let getTemplate = await temp.find({ where: 'new_user_creation' });
    // let mapTemplate = await mapWordsInTempalte(getTemplate, data);

    const userObj = {
      contact: data.work_email,
      templateName: 'new_user_creation',
      first_name:
        data.first_name.charAt(0).toUpperCase() + data.first_name.slice(1),
      password: data.password,
      host_url: `${HOST_IP_FRONT}/auth/signin`,
      last_name:
        data.last_name.charAt(0).toUpperCase() + data.last_name.slice(1),
    };

    const messageSchema = new MessageSchema(userObj);
    const message = await messageSchema.getSchema();
    const messageQueue = new MessageQueue();
    return await messageQueue.send(message);

    // const userObj = {
    //   email: data.work_email,
    //   subject: 'Welcome to BAssure family',
    //   mailContent: generateMailContent('welcome_new_user.js', {
    //     first_name:
    //       data.first_name.charAt(0).toUpperCase() + data.first_name.slice(1),
    //     last_name:
    //       data.last_name.charAt(0).toUpperCase() + data.last_name.slice(1),
    //     email: data.work_email,
    //     password: data.password,
    //     host_url: `${HOST_IP_FRONT}/auth/signin`,
    //   }),
    // };
    // console.log('userObj:::::::::::::::::::::::5554::::', userObj);
    // return await sendMail(userObj);
  } catch (err) {
    console.log(`Email not sent to ${data.work_email}`, err);
  }
});

UserEventEmitter.on('login_with_otp', async (data) => {
  try {
    console.log('Inside create user email_otp trigger event: ', data);

    const employeeObj = {
      contact: data.work_email,
      templateName: 'login_with_otp',
      otp: data.otp,
      event: 'otp',
    };

    // const employeeObj = {
    //   email: data.work_email,
    //   subject: 'Welcome to BAssure family',
    //   mailContent: generateMailContent('login_with_otp.js', {
    //     email: data.work_email,
    //     otp: data.otp,
    //   }),
    // };
    const messageSchema = new MessageSchema(employeeObj);
    const message = await messageSchema.getSchema();
    const messageQueue = new MessageQueue();
    return await messageQueue.send(message);
    // return await sendMail(employeeObj);
  } catch (err) {
    console.log(`Email not sent to ${data.work_email}`, err);
  }
});

UserEventEmitter.on('change_password', async (data) => {
  try {
    console.log('Inside password change email trigger event: ', data);

    // const employeeObj = {
    //   email: data.work_email,
    //   subject: 'Password Change Link',
    //   mailContent: generateMailContent('password_change.js', {
    //     user_name:
    //       data.first_name.charAt(0).toUpperCase() + data.first_name.slice(1),
    //     host_url: `${data.url}/auth/resetpassword`,
    //     token: data.token,
    //     expiry: data.expiry,
    //   }),
    // };

    // return await sendMail(employeeObj);
    const employeeObj = {
      contact: data.work_email,
      host_url: `${data.url}/auth/resetpassword`,
      token: data.token,
      expiry: data.expiry,
      templateName: 'password_change',
      user_name:
        data.first_name.charAt(0).toUpperCase() + data.first_name.slice(1),
    };
    const messageSchema = new MessageSchema(employeeObj);
    const message = await messageSchema.getSchema();
    const messageQueue = new MessageQueue();
    return await messageQueue.send(message);
  } catch (err) {
    console.log(`Email not sent to ${data.work_email}`, err);
  }
});

UserEventEmitter.on('userroles_assigned', async (data) => {
  try {
    let a = data.user.roles.map((x) => x.name);
    a = a.join();
    // const employeeObj = {
    //   email: data.work_email,
    //   subject: 'Roles Assigned',
    //   mailContent: generateMailContent('role_assign.js', {
    //     employee_name: data.first_name,
    //     roles: a,
    //   }),
    // };

    const employeeObj = {
      contact: data.work_email,
      employee_name: data.first_name,
      roles: a,
      templateName: 'role_assign',
    };

    const messageSchema = new MessageSchema(employeeObj);
    const message = await messageSchema.getSchema();
    const messageQueue = new MessageQueue();
    return await messageQueue.send(message);
    // await sendMail(employeeObj);
  } catch (err) {
    console.log(err);
  }
});
// UserEventEmitter.on("userroles_updated", async (initial, final) => {
//   try {
//     let employeeObj;

//     /**To get the initial array of roles */
//     const a = initial.user.roles.map((x) => x.name).sort();
//     /**Toget the updated array of roles */
//     const b = final.user.roles.map((x) => x.name).sort();

//     /**To check the index of the arrays */
//     const A = parseInt(a.length);
//     /**To check the index of the arrays */
//     const B = parseInt(b.length);

//     /**Unique values in both the arrays will be pushed into this empty array*/
//     const newArr = [];
//     /**unique method in the ../../lib/helpers.js */
//     const unike = unique(a, b, newArr).flat();

//     /**To set mail content according to the following conditions*/
//     let content;
//     if (unike === []) {
//       console.log("No need to send email");
//     } else if (A < B) {
//       content = generateMailContent("role_update_add.js", {
//         employee_name: final.first_name,
//         roles: unike,
//         new_roles: a.flat(),
//       });
//     } else if (A > B) {
//       content = generateMailContent("role_update_delete.js", {
//         employee_name: final.first_name,
//         roles: unike,
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

export default UserEventEmitter;
