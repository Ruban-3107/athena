import DB from '../database';
import {
  getPagingData,
  isEmpty,
  customSplit,
  generateString,
  replaceSpecialCharacters,
} from '../util/util';
import { Sequelize, where, Op } from 'sequelize';
import { hash } from 'bcrypt';
import { CreateUserDto } from '../dto/users.dto';
import { HttpException } from '@athena/shared/exceptions';
import { User } from '../interface/users.interface';
// import { userroles } from "@/../../../libs/shared/database/models/src/lib/shared/database/userroles";
import { group, log } from 'console';

import crypto from 'crypto';
import eventEmitter from '../event/user/basic';
import NotificationScheduler from '../crons/schedule_notification';


class UserService {
  public users = DB.DBmodels.users;
  public roles = DB.DBmodels.roles;
  public sequelize = DB.sequelize;
  public userProfiles = DB.DBmodels.user_profiles;
  public clients = DB.DBmodels.clients;
  public notifications = DB.DBmodels.notifications_preferences;
  public follows = DB.DBmodels;

  public getAllFuncs(toCheck) {
    const props = [];
    let obj = toCheck;
    do {
      props.push(...Object.getOwnPropertyNames(obj));
    } while ((obj = Object.getPrototypeOf(obj)));

    return props.sort().filter((e, i, arr) => {
      if (e != arr[i + 1] && typeof toCheck[e] == 'function') return true;
    });
  }

  public async findAllUserWithTrainerRole(): Promise<User[]> {
    let userClients: any;
    let userRoles: any;
    const allUser: User[] = await this.users.findAll({
      include: [
        {
          model: this.roles,
          as: 'userRoles',
          where: { name: 'Trainer' },
        },
      ],
    });
    return allUser;
  }

  public async findUserByHandle(handle: string): Promise<User> {
    if (isEmpty(handle)) throw new HttpException(400, 'UserId is empty');
    let userRoles: any;

    const findUser: User = await this.users.findOne({
      where: { handle: handle },
      include: [
        {
          model: this.roles,
          as: 'userRoles',
          where: userRoles,
        },

        'usersSkillSet',
        'usersUsersCertification',
        'user_employment_history',
      ],
    });
    if (!findUser) throw new HttpException(409, "User doesn't exist");
    // console.log("sssssss", findUser);

    return findUser;
  }

  public async findUserById(userId: number): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty');

    const findUser: User = await this.users.findByPk(userId, {
      include: [
        'userRoles',
        'usersSkillSet',
        'usersUsersCertification',
        'userEmploymentHistory',
      ],
    });
    if (!findUser) throw new HttpException(409, "User doesn't exist");
    // console.log("sssssss", findUser);

    return findUser;
  }

  public async findUsersByIds(userIds: number[]): Promise<User[]> {
    if (userIds.length === 0)
      throw new HttpException(400, 'UserIds array is empty');
    console.log(userIds, '----idsjs');

    const users: User[] = await this.users.findAll({
      where: {
        id: {
          [Op.in]: userIds,
        },
      },
      include: [
        {
          model: this.userProfiles,
          attributes:['preferences'],
          as:'userProfiles'

        },
      ],
    });

    return users;
  }

  // Create user service
  public async createUser(
    userData: CreateUserDto,
    userDataFromToken: User
  ): Promise<User> {
    try {
      // Check if userData is empty
      if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

      // Check if email already exists in the database
      const findEmail = await this.users.findOne({
        where: { email: userData.email },
      });
      if (findEmail) {
        throw new HttpException(
          409,
          `This email ${userData.email} already exists`
        );
      }
      // Check if personal email is the same as primary email
      if (userData.email === userData.personal_email) {
        throw new HttpException(
          409,
          `primary email and secondary email shouldn't be the same`
        );
      }
      // Check if phone number already exists in the database
      const findPhoneNumber = await this.users.findOne({
        where: { phone_number: userData.phone_number },
      });
      if (findPhoneNumber) {
        throw new HttpException(
          409,
          `This phone_number ${userData.phone_number} already exists`
        );
      }

      // Generate handle based on email id
      const mailHandle: any = customSplit(userData.email, '@', 0);
      const handle: any = `${mailHandle.split('@')[0]}_${generateString(4)}`; // handle will be auto generated based on the email id
      userData.handle = handle;

      // Set created_by field to the id of the user creating the new user
      userData.created_by = userDataFromToken.id;

      // Convert first_name and last_name to lowercase and concatenate them
      userData.first_name = userData.first_name.toLowerCase();
      userData.last_name = userData.last_name.toLowerCase();
      const name: string = userData.first_name.concat(' ', userData.last_name);
      userData.name = name.toLowerCase();

      // Generate random password and hash it using bcrypt
      const password = (
        length = 8,
        wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
      ) =>
        Array.from(crypto.randomFillSync(new Uint32Array(length)))
          .map((x: any) => wishlist[x % wishlist.length])
          .join('');
      const user_password = password();
      const hashedPassword = await hash(user_password, 10);

      // Set user status to "pending approval" if the user creating the new user has the role of "Client Representative"
      const clientUser: any = userDataFromToken;
      const findClientReps = clientUser['userRoles'].find((role) => {
        return role.name == 'Client Representative';
      });
      if (findClientReps) {
        userData.is_active = 'pending approval';
      }

      // Create new user in the database
      const createUserData: User = await this.users.create({
        ...userData,
        encrypted_password: hashedPassword,
      });

      console.log('createdddddduserdataa', createUserData);

      // Associate roles with the new user if roles are provided
      if (userData.roles) {
        console.log('hereinroles');

        await this.associateRoles(createUserData.id, userData.roles);
      }

      // Get notifications preferences and create new user profile with preferences
      const notificationsPreferences: any = await this.notifications.findAll({
        where: { status: 'true' },
      });
      const userNotifications = notificationsPreferences.map(
        (x) => x.dataValues.notification_type
      );
      await this.userProfiles.create({
        first_name: createUserData.first_name,
        last_name: createUserData.last_name,
        user_id: createUserData.id,
        contact_email: createUserData.email,
        phone_number: createUserData.phone_number,
        preferences: userNotifications,
      });

      // Emit event to notify other parts of the system that a new user has been created
      if (createUserData && !findClientReps) {
        const emitData = {
          first_name: createUserData.first_name,
          last_name: createUserData.last_name,
          work_email: createUserData.email,
          password: user_password,
        };
        // try {
        //   eventEmitter.emit('new_user_created', emitData);
        // } catch (error) {
        //   console.log('Error emitting event:', error);
        // }
        try {
          // console.log('eeeeeeerrrrrrrrrrr', emitData.work_email);
          // await sendUserCreatedNotification(emitData);
          // console.log("tyytutututu");
          eventEmitter.emit('new_user_created', emitData);
        } catch (error) {
          console.log('eeeeeeeee', error);
        }
        return createUserData;
      }

      // Return the created user object
      console.log('beofre reurnnnnnnn', createUserData);

      // return createUserData;
    } catch (error) {
      console.log(error, '----error in catch of userService-----');
      throw new HttpException(409, error.message);
    }
  }

  public async createMultipleUser(
    userData: CreateUserDto,
    userDataFromToken: User,
    error: any = null,
    condition: string = null
  ): Promise<User> {
    console.log(userData, '---userData0000---');

    function containsSpecialCharacters(name) {
      const regex = /[!@#$%^&*(),.?":{}|<>]/;
      return regex.test(name);
    }
    function isValidPhoneNumber(phoneNumber) {
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
      if (cleanPhoneNumber.length === 10) {
        return true;
      } else {
        return false;
      }
    }
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
    const arrUserData = [];
    arrUserData.push(userData);
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');
    const findEmail = await this.users.findOne({
      where: { email: userData.email },
    });
    const findPhoneNumber = await this.users.findOne({
      where: { phone_number: userData.phone_number },
    });
    if (findEmail) {
      error = { duplicateValue: `${userData.email}` };
      return error;
    }
    if (findPhoneNumber) {
      error = { duplicateValue: `${userData.phone_number}` };
      return error;
    }
    if (!userData.first_name) {
      console.log('no first name');
      error = 'First Name cannot be empty';
      throw new HttpException(409, error);
    }
    if (containsSpecialCharacters(userData.first_name)) {
      console.log('contains special characters');
      error = 'First Name should not contain special characters';
      throw new HttpException(409, error);
    }
    if (!userData.last_name) {
      error = 'Last Name cannot be empty';
      throw new HttpException(409, error);
    }
    if (containsSpecialCharacters(userData.last_name)) {
      error = 'Last Name should not contain special characters';
      throw new HttpException(409, error);
    }
    if (!userData.email) {
      error = 'Email cannot be empty';
      throw new HttpException(409, error);
    }
    if (!isValidEmail(userData.email)) {
      console.log('invalid email');
      error = 'Invalid Email';
      throw new HttpException(409, error);
    }
    if (!userData.phone_number) {
      error = 'Phone cannot be empty';
      throw new HttpException(409, error);
    }
    // if (!isValidPhoneNumber(userData.phone_number)) {
    //   console.log('invalid phone number');
    //   error = 'Invalid Phone Number';
    //   throw new HttpException(409, error);
    // }
    const mailHandle: any = customSplit(userData.email, '@', 0);
    const handle: any = `${mailHandle.split('@')[0]}_${generateString(4)}`;
    userData.handle = handle;
    userData.created_by = userDataFromToken.id;
    userData.first_name = userData.first_name.toLowerCase(); //change to lowercase
    userData.last_name = userData.last_name.toLowerCase();
    const name: string = userData.first_name.concat(' ', userData.last_name); //concat firstname+lastname
    userData.name = name.toLowerCase(); //change to lowercase
    const password = (
      length = 8,
      wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
    ) =>
      Array.from(crypto.randomFillSync(new Uint32Array(length)))
        .map((x: any) => wishlist[x % wishlist.length])
        .join('');
    const user_password = password();
    const hashedPassword = await hash(user_password, 10);
    const createUserData: User = await this.users.create({
      ...userData,
      encrypted_password: hashedPassword,
    });
    console.log(createUserData, '9987654e456789uytrfghjhjkl');
    if (userData.roles) {
      await this.associateRoles(createUserData.id, userData.roles);
    }
    const notificationspreferences: any = await this.notifications.findAll({
      where: { status: 'true' },
    });
    const usernotifications = notificationspreferences.map(
      (x) => x.dataValues.notification_type
    );
    await this.userProfiles.create({
      first_name: createUserData.first_name,
      last_name: createUserData.last_name,
      user_id: createUserData.id,
      contact_email: createUserData.email,
      phone_number: createUserData.phone_number,
      preferences: usernotifications,
    });
    if (createUserData && condition === null) {
      const emitData = {
        first_name: createUserData.first_name,
        last_name: createUserData.last_name,
        work_email: createUserData.email,
        password: user_password,
      };
      try {
        eventEmitter.emit('new_bulk_user_created', emitData);
      } catch (error) {
        console.log(error);
      }
    }
    return createUserData;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public async associateRoles(userId: number, roles: Array<Number>) {
    if (isEmpty(userId)) throw new HttpException(400, "User doesn't exist");
    const roles2 = await this.roles.findAll({
      where: { id: { [Op.in]: roles } },
    });
    const mapIds = roles2?.map((x) => x.id);
    try {
      const userData = await this.users.findByPk(userId);
      console.log(this.getAllFuncs(userData), '---getAllFuncs---'); // to get all available association mixins
      await userData.setUserRoles(mapIds);
    } catch (error) {
      console.log(error);
    }
  }

  public async updateUser(
    handle: string,
    userData: CreateUserDto,
    user: User
  ): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');
    const findUser = await this.users.findOne({
      where: { handle: handle },
    });
    if (!findUser) throw new HttpException(409, "User doesn't exist");
    if (userData.email === userData.personal_email) {
      throw new HttpException(
        409,
        `primary email and secondary email shouldn't be the same`
      );
    }
    userData['updated_by'] = user.id;
    // Add the ID of the updating user to the userData object.

    await this.users.update(userData, { where: { handle: handle } });
    // Update the user with the provided userData, based on the handle.

    if (userData.roles) {
      await this.associateRoles(findUser.id, userData.roles);
    }
    // If roles are specified in the userData, associate those roles with the user.

    const updatedUser = await this.users.findOne({
      where: { handle: handle },
    });
    // Retrieve the updated user from the database.

    return updatedUser;
    // Return the updated user.
  }

  public async userStatus(
    userIds: string[],
    type: string,
    approvedBy
  ): Promise<User> {
    if (userIds.length == 0) {
      throw new HttpException(400, 'Ids are empty');
    }
    const findUser: any[] = await this.users.findAll({
      where: { id: { [Op.in]: userIds } },
    });
    // Find the users based on the provided user IDs using the `Op.in` operator.

    if (!findUser.length) throw new HttpException(404, "User doesn't exist");
    // If no users are found with the provided IDs, throw an HttpException with status code 404 and error message.

    if (type && type == 'disable') {
      await this.users.update(
        { is_active: 'in active' },
        { where: { id: { [Op.in]: userIds } } }
      );
    }
    // If the type is 'disable', update the is_active field of the users to 'in active'.
    else if (type && type == 'enable') {
      await this.users.update(
        { is_active: 'active' },
        { where: { id: { [Op.in]: userIds } } }
      );
    }
    // If the type is 'enable', update the is_active field of the users to 'active'.
    else if (type && type == 'approve') {
      try {
        const [affectedRows] = await this.users.update(
          { is_active: 'active', approved_by: approvedBy },
          { where: { id: { [Op.in]: userIds } } }
        );
        // Update the is_active field of the users to 'active' and set the approved_by field with the provided approvedBy value.

        const updatedUsers = [];
        const users = await this.users.findAll({
          where: { id: { [Op.in]: userIds } },
        });
        updatedUsers.push(...users);
        // Retrieve the updated users from the database and log them to the console.
        /**
         * To send notification to who created(Client Rep) the batch if its approved by the admin
         */
        const notificationType = 'user approved';
        const scheduler = new NotificationScheduler();
        await scheduler.scheduleJobForBooking(
          notificationType,
          updatedUsers,
          approvedBy
        );
      } catch (e) {
        console.log(e, 'error in updating');
        throw new HttpException(400, 'Error in activating the user');
      }
    }
    // If the type is 'approve', update the is_active field of the users to 'active' and set the approved_by field. Also, perform additional actions like sending notifications.
    else {
      await this.users.destroy({ where: { id: { [Op.in]: userIds } } });
    }
    // If none of the above types match, delete the users with the provided IDs.

    return null;
    // Return null since the method signature requires a User type to be returned. Modify it according to your needs.
  }

  public async userStatusNotUsed(
    userId: string[],
    type: string
  ): Promise<User> {
    if (userId.length == 0)
      throw new HttpException(400, 'please provide valid id');
    for (const i in userId) {
      const findUser: User = await this.users.findByPk(userId[i]);
      if (!findUser) throw new HttpException(404, "User doesn't exist");
      //////**********disable and enable user */
      if (type && type == 'disable') {
        await this.users.update(
          { is_active: 'in active' },
          { where: { id: userId[i] } }
        );
      } else if (type && type == 'enable') {
        await this.users.update(
          { is_active: 'active' },
          { where: { id: userId[i] } }
        );
      } else if (type && type == 'approve') {
        await this.users.update(
          { is_active: 'active' },
          { where: { id: userId[i] } }
        );
      }
      ////******** */
      else {
        await this.users.destroy({ where: { id: userId[i] } });
      }
      const emitData: any = {
        first_name: findUser.first_name,
        work_email: findUser.email,
      };
      // UserEventEmitter.emit('user_created', emitData);
    }
    return null;
  }

  public async findUsersByClientId(req: any): Promise<User[]> {
    try {
      const { clientId, user_type: type } = req.params;
      const { searchkey } = req.body;
      if (isEmpty(clientId))
        throw new HttpException(400, 'Please provide a valid corporate');
      const queryobj = {};
      const condition = {
        client_id: clientId,
      };
      if (type && type == 'Client Representative') {
        // condition['roles'] = { [Op.contains]: [type] };
        queryobj['include'] = {
          model: this.roles,
          as: 'userRoles',
          where: { name: { [Op.eq]: 'Client Representative' } },
        };
      }
      queryobj['where'] = condition;
      if (searchkey) {
        queryobj['where'] = {
          [Op.and]: [
            condition,
            {
              [Op.or]: [
                { first_name: { [Op.iLike]: `%${searchkey}%` } },
                { last_name: { [Op.iLike]: `%${searchkey}%` } },
              ],
            },
          ],
        };
      }

      console.log('qqqqqqqqqqqqqq', queryobj);
      const allUser = await this.users.findAll(queryobj);
      // const allUser = await this.sequelize.query(`select * from users where client_id = ${clientId} and (roles):: jsonb ? '${type}'`);
      // const allUser = await this.users.findAll({
      //   where: { client_id: clientId,roles: { [Op.contains]: ["clientRepresentative"] }
      //   }
      // });

      if (!allUser) throw new HttpException(409, "User doesn't exist");
      // console.log('sssssss', allUser);

      return allUser;
    } catch (error) {
      console.log('sssssssssss', error);
    }
  }

  public async findTrainingFacilitator(): Promise<User[]> {
    try {
      // Retrieve users who have the specified role (ID: 11) associated with them.

      const allUser = await this.users.findAll({
        include: {
          model: this.roles,
          as: 'userRoles',
          where: { name: { [Op.eq]: 'Training Facilitator' } },
        },
      });

      console.log(allUser, '---al user---');

      // If no users are found, throw an HttpException with status code 409 and an appropriate error message.
      if (!allUser) throw new HttpException(409, "User doesn't exist");

      return allUser;
      // Return the retrieved users.
    } catch (error) {
      // If an error occurs during the process, throw an HttpException with status code 401 and the error as the message.
      throw new HttpException(401, error);
    }
  }

  public async findJobArchitects(): Promise<User[]> {
    try {
      // const allUser = await this.users.findAll({
      //   where: { roles: { [Op.contains]: ['TrainingFacilitator'] } },
      // });
      const allUser = await this.users.findAll({
        include: {
          model: this.roles,
          as: 'userRoles',
          where: { name: { [Op.eq]: 'Job Architect' } },
        },
      });
      if (!allUser) throw new HttpException(409, "User doesn't exist");
      // console.log('sssssss', allUser);

      return allUser;
    } catch (error) {
      console.log('sssssssssss', error);
    }
  }

  /**NEW: search/ a user by matching keyword with the values in object (Search key works within tabs of Individual and Corporate Users)*/
  public async searchUser(req: any, token: User): Promise<User[]> {
    // Extract relevant information from the request and token parameters
    const tokenUserRoleId = token['dataValues'].userRoles[0].id;
    const { searchKey, type = 'Individual', pageNo, size } = req;
    const keyword = searchKey;
    const tokenUserId = token.id;
    const tokenClientId = token.client_id;

    // Set the initial where condition based on the user type
    let whereCondition: any = {
      deleted_at: null,
      users_type: type,
      // registration_type: 'all',
      // is_active: 'all',
    };

    // Find the role of the token user
    const findRole = await this.roles.findOne({
      where: { id: tokenUserRoleId },
    });

    // Check if the token user has the role of 'Client Representative'
    if (findRole.name === 'Client Representative') {
      // If the role is 'Client Representative', modify the where condition to search for corporate users created by the token user
      whereCondition = {
        deleted_at: null,
        users_type: 'Corporate',
        created_by: tokenUserId,
        // registration_type: 'all',
        // is_active: 'all',
      };
    }

    if (req.type !== 'all') {
      whereCondition.users_type = req.type;
    }
    if (req.registrationType !== 'all') {
      whereCondition.registration_type = req.registrationType;
    }
    if (req.status !== 'all') {
      whereCondition.is_active = req.status;
    }
    // Find the token user and client
    const findUser = await this.users.findOne({ where: { id: tokenUserId } });
    const findClient = await this.clients.findOne({
      where: { id: tokenClientId },
    });
    let userRoles: any;
    if (Array.isArray(req.roles) && req.roles.length > 0) {
      userRoles = { [Op.or]: [] };
      req.roles.forEach((role: any) => {
        userRoles[Op.or].push({ id: role });
      });
    }

    // Get the total count of users based on the where condition
    const totalUsers = await this.users.count({ where: whereCondition });

    // Set the pagination limit and offset
    const limit = size;
    const offset = (pageNo - 1) * limit;
    console.log('uyuyuyuyuyuyu', keyword, whereCondition);
    if (keyword) {
      // If a keyword is provided, perform a search using the keyword
      const response: any = await this.users.findAndCountAll({
        where: {
          [Op.and]: [
            whereCondition,
            {
              [Op.or]: [
                // Search for the keyword in multiple columns
                { name: { [Op.iLike]: `%${keyword}%` } },
                { first_name: { [Op.iLike]: `%${keyword}%` } },
                { last_name: { [Op.iLike]: `%${keyword}%` } },
                { work_email: { [Op.iLike]: `%${keyword}%` } },
                { handle: { [Op.iLike]: `%${keyword}%` } },
                { email: { [Op.iLike]: `%${keyword}%` } },
                { phone_number: { [Op.iLike]: `%${keyword}%` } },
                { provider: { [Op.iLike]: `%${keyword}%` } },
                { alternative_phonenumber: { [Op.iLike]: `%${keyword}%` } },
                { personal_email: { [Op.iLike]: `%${keyword}%` } },
              ],
            },
          ],
        },
        limit,
        offset,
        distinct: true,
        include: [
          {
            model: this.roles,
            as: 'userRoles',
            where: userRoles,
          },
          {
            model: this.userProfiles,
            as: 'userProfiles',
          },
          {
            model: this.clients,
            as: 'client',
          },
        ],
        logging:console.log
      });

      console.log("ussssssssssssssssss",response);

      // Get the paged results using the response and return them
      const foundUsers: any = getPagingData(
        response,
        pageNo,
        limit,
        response.count
      );
      return foundUsers;
    } else {
      console.log('Search key not found');
      // If no search key is provided, log a message
      throw new HttpException(404, 'Search key not found');
    }
  }

  /**NEW: Pagination with sort and filter options*/
  public async userPaginationData(req: any, token: User): Promise<User[]> {
    const tokenUserRoleId = token['dataValues'].userRoles[0].id;
    const tokenUserId = token.id;
    const tokenClientId = token.client_id;
    const findRole = await this.roles.findOne({
      where: { id: tokenUserRoleId },
    });
    const findUser = await this.users.findOne({ where: { id: tokenUserId } });
    const findClient = await this.clients.findOne({
      where: { id: tokenClientId },
    });
    console.log('fffff', findRole);
    if (
      findRole.name == 'Client Representative' &&
      findUser.client_id == findClient.id
    ) {
      const defaultFilterParams = {
        type: 'all',
        registrationType: 'all',
        status: 'all',
        pageNo: 0,
        size: 10,
        roles: 'all',
        clients: 'all',
      };

      // Merge defaults to the req param
      req = { ...defaultFilterParams, ...req };

      // Setting a type for the where object
      type FilterObject = {
        users_type?: any;
        registration_type?: any;
        client_id?: any;
        is_active?: any;
        deleted_at?: any;
      };

      // Empty object in which we can manipulate the where attributes
      const where: FilterObject = {};
      if (req.type !== 'all') {
        where.users_type = req.type;
      }
      if (req.registrationType !== 'all') {
        where.registration_type = req.registrationType;
      }
      if (req.status !== 'all') {
        where.is_active = req.status;
      }
      const totalUsers = await this.users.count({ where: where });
      const limit = req.size;
      const offset = (req.pageNo - 1) * limit;
      let userRoles: any;
      if (Array.isArray(req.roles) && req.roles.length > 0) {
        userRoles = { [Op.or]: [] };
        req.roles.forEach((role: any) => {
          userRoles[Op.or].push({ id: role });
        });
      }
      let userClients: any;
      if (Array.isArray(req.clients) && req.clients.length > 0) {
        userClients = { [Op.or]: [] };
        req.clients.forEach((client: any) => {
          userClients[Op.or].push({ id: client });
        });
      }
      //Can sort with either first_name or email
      const order = [];
      if (req.emailFilter) {
        order.push([`email`, `${req.emailFilter}`]);
      } else if (req.nameFilter) {
        order.push([`first_name`, `${req.nameFilter}`]);
      }
      const response: any = await this.users.findAndCountAll({
        where: {
          users_type: 'Corporate',
          registration_type: 'Platform Registered',
          client_id: findClient.id,
        },
        order,
        limit,
        offset,
        distinct: true,
        include: [
          {
            model: this.roles,
            as: 'userRoles',
            where: userRoles,
          },
          {
            model: this.userProfiles,
            as: 'userProfiles',
          },
          {
            model: this.clients,
            as: 'client',
            where: userClients,
          },
        ],
        logging:console.log
      });
      console.log("kjkjkjkjkjkjkjkj",response)
      // Get the required data in proper format
      const allUser: any = getPagingData(
        response,
        req.pageNo,
        limit,
        response?.count
      );
      return allUser;
    } else {
      console.log('kjkkjjkj');
      const defaultFilterParams = {
        type: 'all',
        registrationType: 'all',
        status: 'all',
        pageNo: 0,
        size: 10,
        roles: 'all',
        clients: 'all',
      };
      // Merge defaults to the req param
      req = { ...defaultFilterParams, ...req };
      // Setting a type for the where object
      type FilterObject = {
        users_type?: any;
        registration_type?: any;
        is_active?: any;
        deleted_at?: any;
      };
      // Empty object in which we can manipulate the where attributes
      const where: FilterObject = {};
      if (req.type !== 'all') {
        where.users_type = req.type;
      }
      if (req.registrationType !== 'all') {
        where.registration_type = req.registrationType;
      }
      if (req.status !== 'all') {
        where.is_active = req.status;
      }
      const totalUsers = await this.users.count({ where: where });
      // Setting page size and page no
      const limit = req.size;
      const offset = (req.pageNo - 1) * limit;
      // Condition for roles
      let userRoles: any;
      if (Array.isArray(req.roles) && req.roles.length > 0) {
        userRoles = { [Op.or]: [] };
        req.roles.forEach((role: any) => {
          userRoles[Op.or].push({ id: role });
        });
      }
      console.log('ghghhhgh', userRoles);
      let userClients: any;
      if (Array.isArray(req.clients) && req.clients.length > 0) {
        userClients = { [Op.or]: [] };
        req.clients.forEach((client: any) => {
          userClients[Op.or].push({ id: client });
        });
      }
      //Can sort with either first_name or email
      const order = [];
      if (req.emailFilter) {
        order.push([`email`, `${req.emailFilter}`]);
      } else if (req.nameFilter) {
        order.push([`first_name`, `${req.nameFilter}`]);
      }
      const response: any = await this.users.findAndCountAll({
        where: where,
        order,
        limit,
        offset,
        distinct: true,
        include: [
          {
            model: this.roles,
            as: 'userRoles',
            where: userRoles,
          },
          {
            model: this.userProfiles,
            as: 'userProfiles',
          },
          {
            model: this.clients,
            as: 'client',
            where: userClients,
          },
        ],
        logging:console.log
      });
      console.log('jkjkjkjk', response);
      // Get the required data in proper format
      const allUser: any = getPagingData(
        response,
        req.pageNo,
        limit,
        response?.count
        // totalUsers
      );

      return allUser;
    }
  }

  public async getallusers(users: any, token: User): Promise<any> {
    try {
      console.log('sr......................');
      const finalArray = [];
      users.forEach((x) => {
        Object.values(x).forEach((y) => finalArray.push(y));
      });
      console.log('useridssss', finalArray);
      const findusers: User[] = await this.users.findAll({
        where: { id: { [Op.in]: finalArray } },
      });
      const a = {};
      users.forEach((x) => {
        Object.entries(x).forEach(([key, value]) => {
          findusers.find((user) => {
            if (Number(user.id) === Number(value)) {
              // x[key] = user;
              a[key] = user;
            }
          });
        });
      });
      console.log('rrrrrrrr', a);
      return a;
    } catch (error) {
      console.log('errorrrrr', error);
    }
  }
}

export default UserService;
