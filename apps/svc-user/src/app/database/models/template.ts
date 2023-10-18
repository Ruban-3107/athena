import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface templateAttributes {
  id: number;
  template_name: string;
  template: string;
  subject:string;
  created_at: Date;
  updated_at: Date;
}
export type templatePk = 'id';
export type templateId = template[templatePk];
export type templateOptionalAttributes = 'id' | 'created_at' | 'updated_at';
export type templateCreationAttributes = Optional<
  templateAttributes,
  templateOptionalAttributes
>;

export class template extends Model implements templateAttributes {
  id!: number;
  template_name!: string;
  template!: string;
  subject!: string;
  created_at!: Date;
  updated_at!: Date;
  //   getUsers!: Sequelize.HasManyGetAssociationsMixin<users>;
  //   setUsers!: Sequelize.HasManySetAssociationsMixin<users, usersId>;

  static initModel(sequelize: Sequelize.Sequelize): typeof template {
    return template.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        template_name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        template: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        subject:{
          type:DataTypes.STRING,
          allowNull:true
        }
      },
      {
        sequelize,
        tableName: 'template',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'template_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'template_name',
            unique: true,
            fields: [{ name: 'template_name' }],
          },
        ],
      }
    );
  }
}
