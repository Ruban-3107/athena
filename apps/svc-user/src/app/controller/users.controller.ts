import { Request, Response, NextFunction } from 'express';
import UsersService from '../service/users.service';
import { CreateUserDto } from '../dto/users.dto';
import { User } from '../interface/users.interface';
import userService from '../service/users.service';
import formidable from 'formidable';
import XLSX from 'xlsx';
import {
  responseCF,
  bodyCF,
  codeValue,
} from '../../../../../libs/commonResponse/commonResponse';
import { customSplit, generateString } from '../util/util';
import eventEmitter from '../event';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RequestWithUser } from '../interface/auth.interface';
// import { RequestWithUser } from '@athena/shared/middleware/interface';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config';
import { HttpException } from '@athena/shared/exceptions';
import { isValidPhoneNumber } from '../helpers';

class UsersController {
  public userService = new userService();

  public getUsersWithTrainerRole = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const findAllUsersData: User[] =
        await this.userService.findAllUserWithTrainerRole();

      const response = responseCF(
        bodyCF({
          val: findAllUsersData,
          code: '600',
          status: 'success',
          message: `Get User Successfully`,
        })
      );
      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          val: 'error',
          code: '625',
          status: 'error',
          message: `${error.message},error in get user by handle`,
        })
      );
      return res.json(response);
    }
  };

  public getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userIds = req.body.users;
     
      const userData: User[] = await this.userService.findUsersByIds(userIds);
      res
        .status(200)
        .json({ data: userData, message: 'findUsers', status: 'success' });
    } catch (error) {
      res
        .status(404)
        .json({ message: error.message, code: error.status, status: 'error' });
    }
  };

  public getUserByHandle = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log('aaaaaaaaawwwweeeee', req.isAdminOrSuperAdmin);
      console.log(
        '@@@@@@@@@@@@@@@@@@@@@',
        req.user?.handle,
        req?.params?.handle
      );

      if (req.isAdminOrSuperAdmin || req.user?.handle === req.params.handle) {
        const handle = req.params.handle;
        const findOneUserData: User = await this.userService.findUserByHandle(
          handle
        );
        const response = responseCF(
          bodyCF({
            val: findOneUserData,
            code: '600',
            status: 'success',
            message: `${findOneUserData.id},Get User Successfully`,
          })
        );
        return res.json(response);
      } else {
        throw new HttpException(
          401,
          `You are not authorized to view this user`
        );
      }
    } catch (error) {
      const response = responseCF(
        bodyCF({
          val: 'error',
          code: '625',
          status: 'error',
          message: `${error.message},error in get user by handle`,
        })
      );
      return res.json(response);
      next(error);
    }
  };

  // Controller function to create a user
  public createUser = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Extract user data from the request body
      const userData: CreateUserDto = req.body;

      // Get user data from the token for created_by and client_id (only if the user data token is a Client Rep)
      const userDataFromToken: User = req.user;

      // Create a user using the userService
      const createUserData: User = await this.userService.createUser(
        userData,
        userDataFromToken
      );

      // Log the created user data
      console.log(createUserData, '--createUserData--');

      // Prepare the success response
      const response = responseCF(
        bodyCF({
          message: 'created',
          code: codeValue.success,
          status: 'success',
        })
      );

      // Send the success response
      return res.json(response);
    } catch (error) {
      // Log any errors that occur
      console.log(error, '--error in catch block of createUser controller--');

      // Prepare the error response
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: '611',
          status: 'error',
        })
      );

      // Send the error response
      return res.json(response);
    }
  };

  public bulkUpload = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    const errorInPhoneNumber = [];
    try {
      console.log('here');

      const userDataFromToken: User = req.user;
      const authHeader = req.headers.authorization;
      const jwtToken = authHeader.split(' ')[1];
      const secret = SECRET_KEY;
      const decoded = jwt.verify(jwtToken, secret);
      const userRole = decoded['role'];
      const names = userRole.map((obj) => obj.name);
      const form: any = formidable({ maxFiles: 1 });
      if (names.includes('Client Representative')) {
        form.parse(req, async (err: any, fields: any, files: any) => {
          if (err) {
            const response = responseCF(
              bodyCF({
                message: { message: err },
                code: '611',
                status: 'error',
              })
            );
            return res.json(response);
          }
          if (!files || !files.file) {
            const response = responseCF(
              bodyCF({
                message: { message: 'File not found' },
                code: '611',
                status: 'error',
              })
            );
            return res.json(response);
          }
          // to check whether the document is in excel format
          if (
            files.file.mimetype ==
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            files.file.mimetype == 'application/vnd.ms-excel'
            // eslint-disable-next-line no-empty
          ) {
          } else {
            const response = responseCF(
              bodyCF({
                message: { message: 'Invalid File Format' },
                code: '611',
                status: 'error',
              })
            );
            return res.json(response);
          }
          console.log(
            typeof fields.client_id,
            '-----fields_client_id------client rep',
            fields.client_id
          );
          fields.client_id = parseInt(fields.client_id);
          console.log(fields.client_id, '-----fields_client_id------');

          const workbook: any = XLSX.readFile(files.file.filepath); //this reads the file
          const sheets: any = workbook.SheetNames; //SheetNames from the excel
          // Reads only the first sheet from the Excel sheet
          const dataFromExcel: any = XLSX.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[0]]
          );
          if (!dataFromExcel.length) {
            const response = responseCF(
              bodyCF({
                message: 'No data found in excel',
                code: '611',
                status: 'error',
              })
            );
            res.json(response);
          } else {
            let success = true; //to determine whether the data was added successfully
            const arrayOfUsersData: any = [];
            let addUsers;
            try {
              for (const userData of dataFromExcel) {
                let error;

                console.log(userData['First Name'], 'gggggg');
                //assigning headings from the excel sheet

                //const phoneNumber = userData['Mobile Number'].toString();
                try {
                  const phoneNumber = userData['Mobile Number'].toString();
                  if (!isValidPhoneNumber(phoneNumber)) {
                    console.log(
                      'errrrrrrorrrr/////////',
                      `Invalid phone number: ${phoneNumber}`
                    );
                    const invalidPhnNum = `${phoneNumber}`;
                    errorInPhoneNumber.push(invalidPhnNum);
                    // console.log("push error in array",a)
                    // throw new Error(`Invalid phone number: ${phoneNumber}`);
                  } else {
                    userData.phone_number = `91${phoneNumber}`;
                    userData.users_type = 'Corporate';
                    userData.first_name = userData['First Name'];
                    userData.last_name = userData['Last Name'];
                    userData.email = userData['Primary Email ID'];
                    userData.personal_email = userData['Secondary Email ID'];
                    userData.roles = JSON.parse(fields.roles);
                    userData.client_id = decoded['client_id'];
                    console.log(userData.email, '------email-------');
                    const mailHandle: unknown = customSplit(
                      userData.email,
                      '@',
                      0
                    ); // to derive handle from emailId
                    const handle: unknown = `${mailHandle}_${generateString(
                      4
                    )}`;
                    userData.handle = handle;
                    userData.is_active = 'pending approval';
                    //userData.phone_number = userData.phone_number.toString(); //converting phone number to string as it comes as a number from excel
                    const condition = 'Client Representative';
                    addUsers = await this.userService.createMultipleUser(
                      userData,
                      userDataFromToken,
                      error,
                      condition
                    ); //to add users
                    console.log(addUsers, 'poiuoiuioijkjhjkjkl');

                    arrayOfUsersData.push(addUsers);
                  }
                } catch (error) {
                  console.log('erorr in phone number firld in excel', error);
                  const response = responseCF(
                    bodyCF({
                      message: error.message,
                      code: '611',
                      status: 'error',
                    })
                  );
                  res.json(response);
                }
              }
            } catch (error) {
              success = false;
              console.log(error);
              const response = responseCF(
                bodyCF({
                  message: error.message,
                  code: '611',
                  status: 'error',
                })
              );
              res.json(response);
            }
            const duplicateValues = []; // to capture the duplicate values
            arrayOfUsersData.map((arr: { duplicateValue: unknown }) => {
              if (arr.duplicateValue) {
                // checking if it has duplicate values and only push the duplicate values
                duplicateValues.push(arr);
              }
            });
            if (duplicateValues.length) {
              // executes => if there are any duplicate emails or phone numbers are found
              const errMsg = ['The following users are already added:'];
              for (let i = 0; i < duplicateValues.length; i++) {
                errMsg.push(duplicateValues[i]['duplicateValue']);
              }

              const response = responseCF(
                bodyCF({
                  message: errMsg,
                  code: '611',
                  status: 'error',
                })
              );
              return res.json(response);
            } else {
              // executes => if there is no duplicate emails or phone numbers
              console.log('here came123456');
              /**Event emmiter*/
              eventEmitter.emit(
                /**Event name */
                'bulk_user_created',

                /**Sending the data to be used at the event listener*/
                arrayOfUsersData
              );
              console.log('', errorInPhoneNumber);
              const response = responseCF(
                bodyCF({
                  message:
                    errorInPhoneNumber.length > 0
                      ? `Invalid Phone numbers:${[errorInPhoneNumber]}`
                      : 'all user added successfully',
                  code: errorInPhoneNumber.length > 0 ? `702` : '600',
                  status: errorInPhoneNumber.length > 0 ? `error` : 'success',
                })
              );
              return res.json(response);
            }
          }
        });
      } else {
        form.parse(req, async (err: any, fields: any, files: any) => {
          if (err) {
            const response = responseCF(
              bodyCF({
                message: { message: err },
                code: '611',
                status: 'error',
              })
            );
            return res.json(response);
          }
          if (!files || !files.file) {
            const response = responseCF(
              bodyCF({
                message: { message: 'File not found' },
                code: '611',
                status: 'error',
              })
            );
            return res.json(response);
          }
          // to check whether the document is in excel format
          if (
            files.file.mimetype ==
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            files.file.mimetype == 'application/vnd.ms-excel'
            // eslint-disable-next-line no-empty
          ) {
          } else {
            const response = responseCF(
              bodyCF({
                message: { message: 'Invalid File Format' },
                code: '611',
                status: 'error',
              })
            );
            return res.json(response);
          }
          console.log(
            typeof fields.client_id,
            '-----fields_client_id2222222222222222222222222------',
            fields.client_id
          );
          fields.client_id = fields.client_id
            ? parseInt(fields.client_id)
            : null;
          console.log(fields.client_id, '-----fields_client_id------');

          const workbook: any = XLSX.readFile(files.file.filepath); //this reads the file
          const sheets: any = workbook.SheetNames; //SheetNames from the excel
          // Reads only the first sheet from the Excel sheet
          const dataFromExcel: any = XLSX.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[0]]
          );
          console.log(typeof dataFromExcel, 'dsfdfdsfdataFromExcel');

          if (!dataFromExcel.length) {
            const response = responseCF(
              bodyCF({
                message: 'No data found in excel',
                code: '611',
                status: 'error',
              })
            );
            res.json(response);
          } else {
            let success = true; //to determine whether the data was added successfully
            const arrayOfUsersData: any = [];
            let addUsers;
            try {
              for (const userData of dataFromExcel) {
                let error;

                console.log(userData['First Name'], 'gggggg');
                //assigning headings from the excel sheet
                try {
                  const phoneNumber = userData['Mobile Number'].toString();
                  if (!isValidPhoneNumber(phoneNumber)) {
                    console.log(
                      'errrrrrrorrrr/////////',
                      `Invalid phone number: ${phoneNumber}`
                    );
                    const invalidPhnNum = `${phoneNumber}`;
                    errorInPhoneNumber.push(invalidPhnNum);
                    console.log('push error in array', invalidPhnNum);
                    console.log(
                      'push error in array errorInPhoneNumber',
                      errorInPhoneNumber
                    );
                  } else {
                    userData.phone_number = `91${phoneNumber}`;
                    userData.users_type = userData['User Type'];
                    userData.first_name = userData['First Name'];
                    userData.last_name = userData['Last Name'];
                    userData.email = userData['Primary Email ID'];
                    userData.personal_email = userData['Secondary Email ID'];
                    userData.roles = JSON.parse(fields.roles);
                    userData.client_id = isNaN(parseInt(fields.client_id))
                      ? null
                      : parseInt(fields.client_id);
                    console.log(userData.email, '------email-------');
                    const mailHandle: unknown = customSplit(
                      userData.email,
                      '@',
                      0
                    ); // to derive handle from emailId
                    const handle: unknown = `${mailHandle}_${generateString(
                      4
                    )}`;
                    userData.handle = handle;
                    userData.phone_number = userData.phone_number.toString(); //converting phone number to string as it comes as a number from excel
                    addUsers = await this.userService.createMultipleUser(
                      userData,
                      userDataFromToken,
                      error
                    ); //to add users
                    console.log(addUsers, 'ffff');

                    arrayOfUsersData.push(addUsers);
                  }
                } catch (error) {
                  console.log('erorr in phone number firld in excel', error);
                  const response = responseCF(
                    bodyCF({
                      message: error.message,
                      code: '611',
                      status: 'error',
                    })
                  );
                  res.json(response);
                }
              }
            } catch (error) {
              success = false;
              console.log(error);
              const response = responseCF(
                bodyCF({
                  message: error.message,
                  code: '611',
                  status: 'error',
                })
              );
              res.json(response);
            }
            const duplicateValues = []; // to capture the duplicate values
            arrayOfUsersData.map((arr: { duplicateValue: unknown }) => {
              if (arr.duplicateValue) {
                // checking if it has duplicate values and only push the duplicate values
                duplicateValues.push(arr);
              }
            });
            if (duplicateValues.length) {
              // executes => if there are any duplicate emails or phone numbers are found
              const errMsg = ['The following users are already added:'];
              for (let i = 0; i < duplicateValues.length; i++) {
                errMsg.push(duplicateValues[i]['duplicateValue']);
              }

              const response = responseCF(
                bodyCF({
                  message: errMsg,
                  code: '611',
                  status: 'error',
                })
              );
              return res.json(response);
            } else {
              // executes => if there is no duplicate emails or phone numbers

              /**Event emmiter*/
              eventEmitter.emit(
                /**Event name */
                'bulk_user_created',

                /**Sending the data to be used at the event listener*/
                arrayOfUsersData
              );
              console.log('fhhfhhfhfhfhhfhfh', errorInPhoneNumber);
              const response = responseCF(
                bodyCF({
                  message: 'All users added successfully',
                  code: 600,
                  status: 'success',
                })
              );
              return res.json(response);
            }
          }
          if (!files || !files.file) {
            const response = responseCF(
              bodyCF({
                message: { message: 'File not found' },
                code: '611',
                status: 'error',
              })
            );
            return res.json(response);
          }
          // to check whether the document is in excel format
          if (
            files.file.mimetype ==
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            files.file.mimetype == 'application/vnd.ms-excel'
            // eslint-disable-next-line no-empty
          ) {
          } else {
            const response = responseCF(
              bodyCF({
                message: { message: 'Invalid File Format' },
                code: '611',
                status: 'error',
              })
            );
            return res.json(response);
          }
          console.log(typeof fields.client_id, '-----fields_client_id------');
          fields.client_id = parseInt(fields.client_id);
          console.log(fields.client_id, '-----fields_client_id------');
        });
      }
    } catch (error) {
      const response = responseCF(
        bodyCF({ message: error.message, code: '611', status: 'error' })
      );
      return res.json(response);
    }
  };

  public updateUser = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const handle = req.params.handle; // Get the user handle from the request parameters
      const userData: CreateUserDto = req.body; // Get the user data from the request body
      const user: User = req.user; // Get the authenticated user from the request
      const updateUserData: User = await this.userService.updateUser(
        handle,
        userData,
        user
      ); // Update the user using the userService with the provided handle, userData, and authenticated user

      // Create a success response
      const response = responseCF(
        bodyCF({
          val: null,
          code: '600',
          status: 'success',
          message: 'User Updated Successfully',
        })
      );
      return res.json(response); // Send the success response as JSON
    } catch (error) {
      // If an error occurs during the update process, create an error response
      const response = responseCF(
        bodyCF({
          val: null,
          code: '611',
          status: 'error',
          message: `User Updation Failed, ${error.message}`,
        })
      );
      return res.json(response); // Send the error response as JSON
      // next(error); // Uncomment this line if you want to pass the error to the next middleware
    }
  };

  public userStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authHeader = req.headers.authorization;
      const jwtToken = authHeader.split(' ')[1];
      const secret = SECRET_KEY;
      const decoded = jwt.verify(jwtToken, secret);
      // Extract the JWT token from the authorization header and decode it using the provided secret key. Log the decoded user ID to the console.

      const approvedBy = decoded['id'];
      // Get the approvedBy value from the decoded JWT token.

      const userIdArray = req.params.id
        .slice(1, req.params.id.length - 1)
        .split(',');
      // Extract the user IDs from the request parameters. The user IDs are in the format of an array as a string. Convert the string into an actual array of user IDs.

      const type = req.params.type;
      // Get the type value from the request parameters.

      const deleteUserData: User = await this.userService.userStatus(
        userIdArray,
        type,
        approvedBy
      );
      // Call the userService's userStatus method to perform the user status update based on the provided user IDs, type, and approvedBy value.

      const response = responseCF(
        bodyCF({
          val: { userData: deleteUserData },
          code: '600',
          status: 'success',
          message: 'user status updated successfully',
        })
      );
      // Create a success response with the deleted user data and appropriate status code and message.

      return res.json(response);
      // Send the success response as JSON.
    } catch (error) {
      const response = responseCF(
        bodyCF({ message: error.message, code: '611', status: 'error' })
      );
      // If an error occurs during the user status update process, create an error response with the error message and appropriate status code.

      return res.json(response);
      // Send the error response as JSON.
    }
  };
  public getUsersByClientId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const clientId = Number(req.params.clientId);
      const type = req.params.user_type;
      const findUserData: User[] = await this.userService.findUsersByClientId(
        req
      );
      const response = responseCF(
        bodyCF({
          val: { userData: findUserData },
          code: 'searchAPI',
          status: 'success',
        })
      );

      return res.json(response);
      // res
      //   .status(200)
      //   .json({ data: findUserData, message: 'findAll', status: 'success' });
    } catch (error) {
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: '611',
          status: 'error',
        })
      );
      console.log(error);
      return res.json(response);
      // res
      //   .status(404)
      //   .json({ message: error.message, code: error.status, status: 'error' });
      // next(error);
    }
  };

  public getTrainingFacilitator = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const findTrainingFacilitatorData: User[] =
        await this.userService.findTrainingFacilitator();
      // Retrieve the training facilitator data by calling the `findTrainingFacilitator` method of the `userService`.

      const response = responseCF(
        bodyCF({
          val: { userData: findTrainingFacilitatorData },
          code: '600',
          status: 'success',
        })
      );
      // Create a success response with the retrieved training facilitator data and appropriate status code.

      return res.json(response);
      // Send the success response as JSON.
    } catch (error) {
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: '611',
          status: 'error',
        })
      );
      console.log(error);
      // Log the error to the console for debugging purposes.

      return res.json(response);
      // Send an error response with the error message and appropriate status code as JSON.
    }
  };

  public getJobArchitects = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const findTrainingFacilitatorData: User[] =
        await this.userService.findJobArchitects();

      const response = responseCF(
        bodyCF({
          val: { userData: findTrainingFacilitatorData },
          code: '600',
          status: 'success',
        })
      );

      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: '611',
          status: 'error',
        })
      );
      console.log(error);
      return res.json(response);
    }
  };

  public getUserBasedOnFilterAndSearch = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { searchKey } = req.body;
      const token: User = req.user;
      let userData: User[];
      if (searchKey) {
        // If a search key is provided, perform a user search
        userData = await this.userService.searchUser(req.body, token);
      } else {
        // If no search key is provided, perform user pagination with filters
        userData = await this.userService.userPaginationData(req.body, token);
      }
      const response = responseCF(
        bodyCF({
          code: '600',
          val: { userData },
          status: 'success',
          message: searchKey ? 'Users searchAPI' : 'Users simpleFilters',
        })
      );
      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          code: '611',
          status: 'error',
          message: error.message,
        })
      );
      console.log(error);
      return res.json(response);
    }
  };

  public getAllUsers = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log('in controllerrrsssss');

      const token: User = req.user;
      let userData = [];
      console.log('controllersssss');

      userData = await this.userService.getallusers(req.body.users, token);
      const response = responseCF(
        bodyCF({
          code: '600',
          val:  userData ,
          status: 'success',
          message: 'All Requested Users',
        })
      );
      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          code: '611',
          status: 'error',
          message: error.message,
        })
      );
      console.log(error);
      return res.json(response);
    }
  };
}

export default UsersController;
