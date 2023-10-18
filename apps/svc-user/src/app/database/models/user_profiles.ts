import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { users, usersId } from './users';

export interface userProfilesAttributes {
  id: number;
  user_id: number;
  twitter?: string;
  facebook?: string;
  github?: string;
  linkedin?: string;
  medium?: string;
  first_name: string;
  last_name: string;
  years_of_experience?: number;
  contact_email: string;
  phone_number: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  about_me: string;
  preferences?: JSON;
  alternate_email?: string;
  alternate_phone_number?: string;
  experience_updated_at?: Date;
  education: string;
  image_url: string;
  createdAt: Date;
  updatedAt: Date;
}

export type userProfilesPk = 'id';
export type userProfilesId = user_profiles[userProfilesPk];
export type userProfilesOptionalAttributes =
  | 'id'
  | 'first_name'
  | 'last_name'
  | 'years_of_experience'
  | 'contact_email'
  | 'phone_number'
  | 'address_line_1'
  | 'address_line_2'
  | 'city'
  | 'state'
  | 'pincode'
  | 'country'
  | 'about_me'
  | 'twitter'
  | 'facebook'
  | 'github'
  | 'linkedin'
  | 'medium'
  | 'createdAt'
  | 'updatedAt'
  | 'experience_updated_at';
export type userProfilesCreationAttributes = Optional<
  userProfilesAttributes,
  userProfilesOptionalAttributes
>;

export class user_profiles extends Model implements userProfilesAttributes {
  includes(notification_type: any): unknown {
    throw new Error('Method not implemented.');
  }
  id!: number;
  user_id!: number;
  twitter?: string;
  facebook?: string;
  github?: string;
  linkedin?: string;
  medium?: string;
  createdAt!: Date;
  updatedAt!: Date;
  first_name!: string;
  last_name!: string;
  years_of_experience?: number;
  contact_email!: string;
  phone_number!: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  about_me!: string;
  preferences?: JSON;
  alternate_email?: string;
  alternate_phone_number?: string;
  experience_updated_at?: Date;
  education!: string;
  image_url: string;

  // userProfiles belongsTo users via user_id
  user!: users;
  getUser!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof user_profiles {
    return user_profiles.init(
      {
        id: {
          autoIncrement: true,
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        user_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        twitter: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        facebook: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        github: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        linkedin: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        medium: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        first_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        last_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        years_of_experience: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },

        contact_email: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        phone_number: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        address_line_1: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        address_line_2: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        city: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        state: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        pincode: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        country: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        about_me: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        preferences: {
          type: Sequelize.JSONB,
          allowNull: true,
        },
        alternate_email: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        alternate_phone_number: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        experience_updated_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        education: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        image_url: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {
        sequelize,
        tableName: 'user_profiles',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'index_user_profiles_on_user_id',
            unique: true,
            fields: [{ name: 'user_id' }],
          },
          {
            name: 'user_profiles_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}
