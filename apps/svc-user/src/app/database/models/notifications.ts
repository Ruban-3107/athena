import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface notificationsAttributes {
  id: number;
  user_ids: string;
  email: boolean;
  sms: boolean;
  whats_app: boolean;
  in_app_notification: boolean;
  notification_type?: string;
  created_at: Date;
  updated_at: Date;
  viewed: boolean;
  schedule_unique_id: string;
  created_by:string
}
export type notificationsPk = 'id';
export type notificationsId = notifications[notificationsPk];
export type notificationsOptionalAttributes =
  | 'id'
  | 'created_at'
  | 'updated_at';
export type notificationsCreationAttributes = Optional<
  notificationsAttributes,
  notificationsOptionalAttributes
>;
export class notifications extends Model implements notificationsAttributes {
  id!: number;
  user_ids!: string;
  email!: boolean;
  sms!: boolean;
  whats_app!: boolean;
  in_app_notification!: boolean;
  notification_type?: string;
  created_at!: Date;
  updated_at!: Date;
  viewed!: boolean;
  schedule_unique_id!: string;
  created_by!:string

  static initModel(sequelize: Sequelize.Sequelize): typeof notifications {
    return notifications.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        user_ids: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        email: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        sms: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        whats_app: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        notifications_for: {
          type: DataTypes.JSONB, // change the data type to JSONB
          allowNull: false // set allowNull to true
        },
        viewed: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        schedule_unique_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        created_by: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'notifications',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'notifications_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'schedule_unique_id_notification',
            fields: [{ name: 'schedule_unique_id' }],
          },
         
        ],
      }
    );
  }
}



