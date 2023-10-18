import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface rolesAttributes {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}
export type rolesPk = 'id';
export type rolesId = _roles[rolesPk];
export type rolesOptionalAttributes = 'id' | 'created_at' | 'updated_at';
export type rolesCreationAttributes = Optional<
  rolesAttributes,
  rolesOptionalAttributes
>;
export class _roles extends Model implements rolesAttributes {
  id!: number;
  name!: string;
  created_at!: Date;
  updated_at!: Date;

  static initModel(sequelize: Sequelize.Sequelize): typeof _roles {
    return _roles.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        permissions: {
          type: Sequelize.TEXT,
          allowNull: true,
          get() {
            let permissions = [];
            try {
              permissions = this.getDataValue('permissions');
            } catch (error) {
              console.log(error);
            }
            return permissions;
          },
        },
      },

      {
        sequelize,
        tableName: '_roles',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'roles_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'index_roles_on_name',
            unique: true,
            fields: [{ name: 'name' }],
          },
        ],
      }
    );
  }
}
