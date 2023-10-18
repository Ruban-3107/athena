import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { users, usersId } from './users';

export interface skillSetAttributes {
  id: number;
  label: string;
  value?: string;
  created_at: Date;
  updated_at: Date;
}
export type skillSetPk = 'id';
export type skillSetId = _skill_set[skillSetPk];
export type skillSetOptionalAttributes = 'id' | 'created_at' | 'updated_at';
export type skillSetCreationAttributes = Optional<
  skillSetAttributes,
  skillSetOptionalAttributes
>;

export class _skill_set extends Model implements skillSetAttributes {
  id!: number;
  label!: string;
  value?: string;
  created_at!: Date;
  updated_at!: Date;
  user_id!: users[];
  getUsers!: Sequelize.HasManyGetAssociationsMixin<users>;
  setUsers!: Sequelize.HasManySetAssociationsMixin<users, usersId>;

  static initModel(sequelize: Sequelize.Sequelize): typeof _skill_set {
    return _skill_set.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        label: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        value: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: '_skill_set',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: '_skill_set_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: '_skill_set_lable',
            unique: true,
            fields: [{ name: 'label' }],
          },
        ],
      }
    );
  }
}
