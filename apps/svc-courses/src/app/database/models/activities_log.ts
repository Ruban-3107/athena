import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface activitiesAttributes {
  id: number;
  user_id: number;
  module_type: string;
  module_id: string;
  module_name: string;
  action: string;
}

export type activitiesPk = 'id';
export type activitiesId = activities_log[activitiesPk];
export type activitiesOptionalAttributes =
  | 'id'
  | 'user_id'
  | 'module_type'
  | 'module_id'
  | 'module_name'
  | 'action';
export type activitiesCreationAttributes = Optional<
  activitiesAttributes,
  activitiesOptionalAttributes
>;

export class activities_log extends Model implements activitiesAttributes {
  id: number; //1
  user_id: number; //200094
  module_id: string; ////154/200076
  module_type: string; ///topic/user
  module_name: string; //java/sarath
  action: string; //create/update

  static initModel(sequelize: Sequelize.Sequelize): typeof activities_log {
    return activities_log.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        module_id: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        module_type: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        module_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        action: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'activities_log',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'activities_log_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}
