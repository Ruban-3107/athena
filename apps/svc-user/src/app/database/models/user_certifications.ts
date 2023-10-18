import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { users, usersId } from './users';

export interface userCertificationsAttributes {
  id: number;
  user_id: number;
  provider_id: number;
  certification_type?: string;
  certification_id?: string;
  certificate_upload: string;
  certification_url?: string;
  // provider: string;
  date_achieved: Date;
  date_expires?: Date;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export type userCertificationsPk = 'id';
export type userCertificationsId = user_certifications[userCertificationsPk];
export type userCertificationsOptionalAttributes =
  | 'id'
  | 'date_expires'
  | 'description';
export type userCertificationsCreationAttributes = Optional<
  userCertificationsAttributes,
  userCertificationsOptionalAttributes
>;

/**Sanjeev Gunasekaran 200089 (new model) */
export class user_certifications extends Model implements userCertificationsAttributes {
  id!: number;
  user_id!: number;
  provider_id!: number;
  certification_type?: string;
  certification_id?: string;
  certificate_upload!: string;
  certification_url?: string;
  //provider!: string;
  date_achieved!: Date;
  date_expires?: Date;
  description?: string;
  created_at!: Date;
  updated_at!: Date;

  // certifications belongs to users via certificationsId
  certifications!: user_certifications[];
  getCertifications!: Sequelize.BelongsToGetAssociationMixin<users>;
  setCertifications!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createCertifications!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof user_certifications {
    return user_certifications.init(
      {
        id: {
          autoIncrement: true,
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true
        },
        user_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          }
        },
        provider_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          references: {
            model: '_certification_providers',
            key: 'id'
          }
        },
  
        certificate_upload: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        date_achieved: {
          type: Sequelize.STRING,
          allowNull: false
        },
        date_expires: {
          type: Sequelize.STRING,
          allowNull: true
        },
        description: {
          type: Sequelize.STRING,
          allowNull: true
        },
        certification_type: {
          type: Sequelize.STRING,
          allowNull: true
        },
        certification_id: {
          type: Sequelize.STRING,
          allowNull: true
        },
        certification_url: {
          type: Sequelize.STRING,
          allowNull: true
        },
  
        created_at: {
          allowNull: true,
          type: Sequelize.DATE
        },
        updated_at: {
          allowNull: true,
          type: Sequelize.DATE
        },
      },
        {
          sequelize,
          tableName: 'user_certifications',
          schema: 'public',
          timestamps: true,
          indexes: [
            {
              name: "user_certifications_pkey",
              unique: true,
              fields: [
                { name: "id" }
              ]
            }, {
              name: "index_user_certifications_on_user_id",
              fields: [
                { name: "user_id" },
              ]
            }
          ]
        },
    );
  }
}
