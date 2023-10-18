import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface userNotificationsAttributes {
  id: number;
  user_id: number;
  notification_for?: JSON;
  created_at: Date;
  updated_at: Date;
  viewed: boolean;
  ref_id: string;
  created_by: string;
}
export type notificationsPk = 'id';
export type userNotificationsId = userNotifications[notificationsPk];
export type userNotificationsOptionalAttributes =
  | 'id'
  | 'created_at'
  | 'updated_at';
export type userNotificationsCreationAttributes = Optional<
  userNotificationsAttributes,
  userNotificationsOptionalAttributes
>;

export class userNotifications
  extends Model
  implements userNotificationsAttributes
{
  id!: number;
  user_id!: number;
  created_at!: Date;
  updated_at!: Date;
  viewed!: boolean;
  ref_id!: string;
  created_by!: string;
  notifications_for: JSON;

  static initModel(sequelize: Sequelize.Sequelize): typeof userNotifications {
    return userNotifications.init(
      {
        id: {
          autoIncrement: true,
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        notifications_for: {
          type: Sequelize.JSONB, // change the data type to JSONB
          allowNull: false, // set allowNull to true
        },
        viewed: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        ref_id: {
          type: Sequelize.STRING,
          allowNull: true
        },
        created_by: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        user_id: {
          type: Sequelize.NUMBER,
          allowNull: false,
        },
      
      },

      {
        sequelize,
        tableName: 'user_notification',
        schema: 'public',
        timestamps: true,
        indexes: [

          {
            name: 'users_notification_id',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}
