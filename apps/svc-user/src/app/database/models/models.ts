import { Model, type Sequelize } from 'sequelize';
import { users as _users } from './users';
import type { usersAttributes, usersCreationAttributes } from './users';
import { user_sessions_history as _user_sessions_history } from './user_sessions_history';
import type {
  userSessionsHistoryAttributes,
  userSessionsHistoryCreationAttributes,
} from './user_sessions_history';
import { _roles as _roles } from './_roles';
import type { rolesAttributes, rolesCreationAttributes } from './_roles';
import { _notifications_preferences as _notifications_preferences } from './_notifications_preferences';
import type {
  notificationsPreferencesAttributes,
  notificationsPreferencesCreationAttributes,
} from './_notifications_preferences';
import { user_profiles as _user_profiles } from './user_profiles';
import type {
  userProfilesAttributes,
  userProfilesCreationAttributes,
} from './user_profiles';
import { _clients as _clients } from './_clients';
import type { clientsAttributes, clientsCreationAttributes } from './_clients';
import { employment_history as _employment_history } from './employment_history';
import {
  employmenthistoryAttributes,
  employmenthistoryCreationAttributes,
} from './employment_history';
import { notifications as _notifications } from './notifications';
import {
  notificationsAttributes,
  notificationsCreationAttributes,
} from './notifications';
import { _modules as _modules } from './_modules';
import { modulesAttributes, modulesCreationAttributes } from './_modules';
import { _certification_providers } from './_certification_providers';
import {
  certificationProvidersAttributes,
  certificationProvidersCreationAttributes,
} from './_certification_providers';
import { user_certifications as _user_certifications } from './user_certifications';
import {
  userCertificationsAttributes,
  userCertificationsCreationAttributes,
} from './user_certifications';
import { _skill_set as _skill_set } from './_skill_set';
import { skillSetAttributes, skillSetCreationAttributes } from './_skill_set';
import NotificationScheduler from '../../crons/schedule_notification';
import { company as _company } from './company';
import type { companyAttributes, companyCreationAttributes } from './company';
import { userdatahistory as _userdatahistory } from './userdatahistory';
import type {
  userdatahistoryAttributes,
  userdatahistoryCreationAttributes,
} from './userdatahistory';
import { template as _template } from './template';
import type { templateAttributes, templateCreationAttributes } from './template';
import { userNotifications as _userNotifications } from './user_notification';

export {
  _users as users,
  _user_sessions_history as user_sessions_history,
  _roles as roles,
  _notifications_preferences as notifications_preferences,
  _user_profiles as user_profiles,
  _clients as clients,
  _employment_history as employment_history,
  _notifications as notifications,
  _modules as modules,
  _certification_providers as certificationProviders,
  _skill_set as skill_set,
  _company as _company,
  _userdatahistory as userdatahistory,
  _template as template,
  _userNotifications as  userNotifications
};

export type {
  usersAttributes,
  usersCreationAttributes,
  userSessionsHistoryAttributes,
  userSessionsHistoryCreationAttributes,
  rolesAttributes,
  rolesCreationAttributes,
  notificationsPreferencesAttributes,
  notificationsPreferencesCreationAttributes,
  userProfilesAttributes,
  userProfilesCreationAttributes,
  clientsAttributes,
  clientsCreationAttributes,
  employmenthistoryAttributes,
  employmenthistoryCreationAttributes,
  notificationsAttributes,
  notificationsCreationAttributes,
  modulesAttributes,
  modulesCreationAttributes,
  certificationProvidersAttributes,
  certificationProvidersCreationAttributes,
  userCertificationsAttributes,
  userCertificationsCreationAttributes,
  skillSetAttributes,
  skillSetCreationAttributes,
  companyAttributes,
  companyCreationAttributes,
  templateAttributes,
  templateCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const users = _users.initModel(sequelize);
  const user_sessions_history = _user_sessions_history.initModel(sequelize);
  const roles = _roles.initModel(sequelize);
  const notifications_preferences =
    _notifications_preferences.initModel(sequelize);
  const user_profiles = _user_profiles.initModel(sequelize);
  const clients = _clients.initModel(sequelize);
  const employment_history = _employment_history.initModel(sequelize);
  const notifications = _notifications.initModel(sequelize);
  const modules = _modules.initModel(sequelize);
  const certification_providers = _certification_providers.initModel(sequelize);
  const user_certifications = _user_certifications.initModel(sequelize);
  const skill_set = _skill_set.initModel(sequelize);
  const company = _company.initModel(sequelize);
  const userdatahistory = _userdatahistory.initModel(sequelize);
  const template = _template.initModel(sequelize);
  const userNotifications = _userNotifications.initModel(sequelize);
  

  //associations:
  user_sessions_history.belongsTo(users, {
    as: 'userSessionHistoryUsers',
    foreignKey: 'user_id',
  });
  users.hasMany(user_sessions_history, {
    as: 'usersUserSessionHistory',
    foreignKey: 'user_id',
  });
  users.belongsToMany(roles, {
    as: 'userRoles',
    through: 'user_roles',
  });
  users.hasOne(user_profiles, {
    as: 'userProfiles',
    foreignKey: 'user_id',
  });
  user_profiles.belongsTo(users, {
    as: 'userProfilesUser',
    foreignKey: 'user_id',
  });
  users.belongsToMany(skill_set, {
    as: 'users_skillset',
    through: 'usersskillset',
  });
  employment_history.belongsTo(users, { as: 'user', foreignKey: 'user_id' });
  users.hasMany(employment_history, {
    as: 'user_employment_history',
    foreignKey: 'user_id',
  });
  user_profiles.belongsTo(users, { as: 'user', foreignKey: 'user_id' });
  users.belongsTo(clients, { as: 'client', foreignKey: 'client_id' });
  clients.hasMany(users, { as: 'clientUsers', foreignKey: 'client_id' });

  // users.hasOne(notifications, {
  //   as: 'userNotifications',
  //   foreignKey: 'user_id',
  // });
  // notifications.belongsTo(users, {
  //   as: 'notificationsUsers',
  //   foreignKey: 'user_id',
  // });


  user_certifications.belongsTo(_certification_providers, {
    as: 'certificationProviders',
    foreignKey: 'provider_id',
  });
  _certification_providers.hasOne(user_certifications, {
    as: 'userCertifications',
    foreignKey: 'provider_id',
  });
  user_certifications.belongsTo(users, { as: 'user', foreignKey: 'user_id' });
  users.hasMany(user_certifications, {
    as: 'usersUsersCertification',
    foreignKey: 'user_id',
  });
  users.belongsToMany(skill_set, {
    as: 'usersSkillSet',
    through: 'users_skill_set',
  });
  userdatahistory.belongsTo(users, {
    as: 'datahistory_user',
    foreignKey: 'user_id',
  });
  users.hasMany(userdatahistory, {
    as: 'user_datahistory',
    foreignKey: 'user_id',
  });


  //triggers you want to add
  /**
   * To send notification to the user to update his profile.
   * This notification will be sent if the user sign in after signing up for the first time, by changing his generated password to his own password
   */
  // users.afterUpdate(async (user, options) => {
  //   console.log('---triggeeddd');
  //   if (user.changed('is_password_changed')) {
  //     console.log(user, '---triggged user---');
  //     const notificationType = 'update profile';
  //     const scheduler = new NotificationScheduler();
  //     await scheduler.scheduleJobForBooking(notificationType, user);
  //   }
  // });

  return {
    users: users,
    roles: roles,
    notifications_preferences: notifications_preferences,
    user_profiles: user_profiles,
    clients: clients,
    employment_history: employment_history,
    notifications: notifications,
    modules: modules,
    certification_providers: certification_providers,
    user_certifications: user_certifications,
    skill_set: skill_set,
    user_sessions_history: user_sessions_history,
    company: company,
    userdatahistory: userdatahistory,
    template: template,
    userNotifications:userNotifications
  };
}
