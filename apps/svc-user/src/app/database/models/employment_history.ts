import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { users, usersId } from './users';

export interface employmenthistoryAttributes {
  id: number;
  user_id: number;
  company: string;
  job_title: string;
  job_description: string;
  start_month: Date;
  end_month: Date;
  created_at?: Date;
  updated_at?: Date;
}

export type employmentHistoryPk = 'id';
export type employmentHistoryId = employment_history[employmentHistoryPk];
export type employmentHistoryOptionalAttributes =
  | 'id'
  | 'created_at'
  | 'updated_at';
export type employmenthistoryCreationAttributes = Optional<
  employmenthistoryAttributes,
  employmentHistoryOptionalAttributes
>;

export class employment_history
  extends Model
  implements employmenthistoryAttributes
{
  id!: number;
  user_id!: number;
  company!: string;
  job_title!: string;
  job_description!: string;
  start_month!: Date;
  end_month!: Date;
  created_at?: Date;
  updated_at?: Date;

  // employmentHistory belongsTo users via user_id
  user!: users;
  getUser!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof employment_history {
    return employment_history.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        company: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        job_title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        job_description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        start_month: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        end_month: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        tableName: 'employment_history',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'employment_history_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'index_employment_history_on_user_id',
            fields: [{ name: 'user_id' }],
          },
        ],
      }
    );
  }
}
