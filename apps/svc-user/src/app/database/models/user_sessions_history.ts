import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface userSessionsHistoryAttributes {
  id: number;
  user_id: number;
  sign_up_at: Date;
  is_email_verified: boolean;
  is_password_changed: boolean;
  started_at: Date;
  user_name: string;
  user_roles: string[];
}
export type userSessionsHistoryPk = 'id';
export type skillSetId = user_sessions_history[userSessionsHistoryPk];
export type userSessionsHistoryOptionalAttributes =
  | 'id'
  | 'started_at'
export type userSessionsHistoryCreationAttributes = Optional<
  userSessionsHistoryAttributes,
  userSessionsHistoryOptionalAttributes
>;

export class user_sessions_history
  extends Model
  implements userSessionsHistoryAttributes
{
  id!: number;
  user_id!: number;
  sign_up_at!: Date;
  is_email_verified!: boolean;
  is_password_changed!: boolean;
  started_at: Date;
  user_name!: string;
  user_roles!: string[];

  static initModel(
    sequelize: Sequelize.Sequelize
  ): typeof user_sessions_history {
    return user_sessions_history.init(
      {
        id: {
          autoIncrement: true,
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        user_id: {
          allowNull: false,
          type: Sequelize.BIGINT,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        field: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        sign_up_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        sign_in_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        sign_out_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        is_email_verified: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        is_password_changed: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        user_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        user_roles: {
          type: Sequelize.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'user_sessions_history',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'user_sessions_history_pky',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}
