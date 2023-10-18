import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface notificationsPreferencesAttributes {
  id: number;
  notification_type: string;
  status: boolean;
  description?: string;
  created_at: Date;
  updated_at: Date;
}
export type notificationsPreferencesPk = 'id';
export type notificationsPreferencesId =
_notifications_preferences[notificationsPreferencesPk];
export type notificationsPreferencesOptionalAttributes =
  | 'id'
  | 'created_at'
  | 'updated_at';
export type notificationsPreferencesCreationAttributes = Optional<
  notificationsPreferencesAttributes,
  notificationsPreferencesOptionalAttributes
>;
export class _notifications_preferences
  extends Model
  implements notificationsPreferencesAttributes
{
  id!: number;
  notification_type!: string;
  status!: boolean;
  description?: string;
  created_at!: Date;
  updated_at!: Date;

  static initModel(
    sequelize: Sequelize.Sequelize
  ): typeof _notifications_preferences {
    return _notifications_preferences.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        notification_type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        status: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        }
        
      },
      {
        sequelize,
        tableName: '_notifications_preferences',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: '_notifications_preferences_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}
