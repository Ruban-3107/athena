import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional, NonAttribute } from 'sequelize';
import type { _roles, rolesId } from './_roles';
import type { _skill_set } from './_skill_set';
import { skill_set } from './models';
import {
  ACTIVITIES_LOG_URL,
  COURSES_SERVICE_PORT,
  COURSES_SERVICE_URL,
} from '../../config';
const axios = require('axios');

export interface usersAttributes {
  id: number;
  handle: string;
  first_name: string;
  provider?: string;
  uid?: string;
  email: string;
  encrypted_password?: string;
  reset_password_token?: string;
  reset_password_sent_at?: Date;
  remember_created_at?: Date;
  confirmation_token?: string;
  confirmed_at?: Date;
  confirmation_sent_at?: Date;
  unconfirmed_email?: string;
  accepted_privacy_policy_at?: Date;
  accepted_terms_at?: Date;
  became_mentor_at?: Date;
  deleted_at?: Date;
  joined_research_at?: Date;
  github_username?: string;
  reputation: number;
  bio?: string;
  avatar_url?: string;
  location?: string;
  pronouns?: string;
  num_solutions_mentored: number;
  mentor_satisfaction_percentage?: number;
  stripe_customer_id?: string;
  total_donated_in_cents?: number;
  active_donation_subscription?: boolean;
  created_at: Date;
  updated_at: Date;
  show_on_supporters_page: boolean;
  client_id?: number;
  phone_number?: string;
  personal_email?: string;
  // is_active: boolean;
  users_type: string;
  alternative_phonenumber?: string;
  email_confirmed?: string;
  last_name?: string;
  work_email?: string;
  created_by?: number;
  resetpassword?: string;
  is_password_changed: boolean;
  password_updated_at?: Date;
  updated_by?: number;
  name?: string;
  is_active: string;
  approved_by?: number;
}

export type usersPk = 'id';
export type usersId = users[usersPk];
export type usersOptionalAttributes =
  | 'id'
  | 'client_id'
  | 'provider'
  | 'uid'
  | 'email'
  | 'encrypted_password'
  | 'reset_password_token'
  | 'reset_password_sent_at'
  | 'remember_created_at'
  | 'confirmation_token'
  | 'confirmed_at'
  | 'confirmation_sent_at'
  | 'unconfirmed_email'
  | 'accepted_privacy_policy_at'
  | 'accepted_terms_at'
  | 'became_mentor_at'
  | 'deleted_at'
  | 'joined_research_at'
  | 'github_username'
  | 'reputation'
  | 'bio'
  | 'avatar_url'
  | 'location'
  | 'pronouns'
  | 'num_solutions_mentored'
  | 'mentor_satisfaction_percentage'
  | 'stripe_customer_id'
  | 'total_donated_in_cents'
  | 'active_donation_subscription'
  | 'created_at'
  | 'updated_at'
  | 'show_on_supporters_page'
  | 'updated_by'
  | 'name';
export type usersCreationAttributes = Optional<
  usersAttributes,
  usersOptionalAttributes
>;

export class users extends Model implements usersAttributes {
  users() {
    console.log('user constructor called');
  }

  id!: number;
  handle!: string;
  first_name!: string;
  provider?: string;
  uid?: string;
  email!: string;
  encrypted_password?: string;
  reset_password_token?: string;
  reset_password_sent_at?: Date;
  remember_created_at?: Date;
  confirmation_token?: string;
  confirmed_at?: Date;
  confirmation_sent_at?: Date;
  unconfirmed_email?: string;
  accepted_privacy_policy_at?: Date;
  accepted_terms_at?: Date;
  became_mentor_at?: Date;
  deleted_at?: Date;
  joined_research_at?: Date;
  github_username?: string;
  reputation!: number;
  bio?: string;
  avatar_url?: string;
  location?: string;
  pronouns?: string;
  num_solutions_mentored!: number;
  mentor_satisfaction_percentage?: number;
  stripe_customer_id?: string;
  total_donated_in_cents?: number;
  active_donation_subscription?: boolean;
  created_at!: Date;
  updated_at!: Date;
  show_on_supporters_page!: boolean;
  client_id?: number;
  phone_number?: string;
  personal_email?: string;
  //is_active!: boolean;
  users_type!: string;
  alternative_phonenumber?: string;
  email_confirmed?: string;
  last_name?: string;
  work_email?: string;
  created_by?: number;
  resetpassword?: string;
  is_password_changed!: boolean;
  password_updated_at?: Date;
  updated_by?: number;
  name?: string;
  is_active!: string;
  approved_by?: number;

  // users belongs to many roles
  //roles!: roles[];
  roles?: NonAttribute<_roles[]>;
  getUserRoles!: Sequelize.BelongsToManyGetAssociationsMixin<_roles>;
  setUserRoles!: Sequelize.BelongsToManySetAssociationsMixin<_roles, number>;
  addUserRoles!: Sequelize.BelongsToManyAddAssociationMixin<_roles, rolesId>;
  createUserRole!: Sequelize.BelongsToManyCreateAssociationMixin<_roles>;

  setUsers_skillset!: Sequelize.BelongsToManySetAssociationsMixin<
    skill_set,
    number
  >;

  static initModel(sequelize: Sequelize.Sequelize): typeof users {
    const model = users.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        handle: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        first_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        provider: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        uid: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: '',
        },
        encrypted_password: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        reset_password_token: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        reset_password_sent_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        remember_created_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        confirmation_token: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        confirmed_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        confirmation_sent_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        unconfirmed_email: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        accepted_privacy_policy_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        accepted_terms_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        became_mentor_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        joined_research_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        github_username: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        reputation: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        bio: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        avatar_url: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        location: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        pronouns: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        num_solutions_mentored: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        mentor_satisfaction_percentage: {
          type: DataTypes.SMALLINT,
          allowNull: true,
        },
        stripe_customer_id: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        total_donated_in_cents: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        active_donation_subscription: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        show_on_supporters_page: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        client_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        roles: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        phone_number: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        personal_email: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        users_type: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'Individual',
        },
        alternative_phonenumber: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        email_confirmed: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        last_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        work_email: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        created_by: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        registration_type: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'Platform Registered',
        },
        athena_id: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        resetpassword: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        is_password_changed: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        password_updated_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        updated_by: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        approved_by: {
          type: Sequelize.BIGINT,
          allowNull: true,
        },
        is_active: {
          type: Sequelize.ENUM('active', 'in active', 'pending approval'),
          allowNull: false,
          defaultValue: 'active',
        },
      },
      {
        sequelize,
        tableName: 'users',
        schema: 'public',
        timestamps: true,
        paranoid: true,
        defaultScope: {
          attributes: {
            exclude: [
              'reset_password_token',
              'confirmation_token',
              'stripe_customer_id',
            ],
          },
        },
        indexes: [
          {
            name: 'index_users_on_confirmation_token',
            unique: true,
            fields: [{ name: 'confirmation_token' }],
          },
          {
            name: 'index_users_on_email',
            unique: true,
            fields: [{ name: 'email' }],
          },
          {
            name: 'index_users_on_github_username',
            unique: true,
            fields: [{ name: 'github_username' }],
          },
          {
            name: 'index_users_on_handle',
            unique: true,
            fields: [{ name: 'handle' }],
          },
          {
            name: 'index_users_on_provider_and_uid',
            unique: true,
            fields: [{ name: 'provider' }, { name: 'uid' }],
          },
          {
            name: 'index_users_on_reset_password_token',
            unique: true,
            fields: [{ name: 'reset_password_token' }],
          },
          {
            name: 'index_users_on_stripe_customer_id',
            unique: true,
            fields: [{ name: 'stripe_customer_id' }],
          },
          {
            name: 'index_users_on_unconfirmed_email',
            fields: [{ name: 'unconfirmed_email' }],
          },
          {
            name: 'users-supporters-page',
            fields: [
              { name: 'total_donated_in_cents' },
              { name: 'show_on_supporters_page' },
            ],
          },
          {
            name: 'users_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );

    users.afterCreate(async (instance, options) => {
      const createdata = {
        module_id: instance.id,
        module_type: this.tableName,
        module_name: instance.first_name,
        action: 'create',
        user_id: Number(instance.created_by),
      };

      console.log('modelllsssssssssss userssss dataaaa:', createdata);

      const data = await axios
        .post(
          `${COURSES_SERVICE_URL}:${COURSES_SERVICE_PORT}/${ACTIVITIES_LOG_URL}`,
          createdata
        )
        .then((response) => {
          // Handle the response data
          console.log('axiossssresopnseeeeeee', response.data);
          return response.data;
        });
      console.log('activitiessssssdaaaataaaaaa', data);
      return data;
    });

    users.afterUpdate(async (instance, options) => {
      const updatedata = {
        module_id: instance.id,
        module_type: this.tableName,
        module_name: instance.first_name,
        action: 'update',
        user_id: instance.created_by,
      };
      const data = await axios.post(
        `${COURSES_SERVICE_URL}:${COURSES_SERVICE_PORT}/${ACTIVITIES_LOG_URL}`,
        updatedata
      );
      return data;
    });
    return model;
  }
}
