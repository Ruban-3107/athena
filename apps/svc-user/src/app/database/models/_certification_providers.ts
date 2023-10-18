import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { users, usersId } from './users';

export interface certificationProvidersAttributes {
  id: number;
  logo?: string;
  label: string;
  value?: string;
  created_at: Date;
  updated_at: Date;
}
export type certificationProvidersPk = 'id';
export type certificationProvidersId = _certification_providers[certificationProvidersPk];
export type certificationProvidersOptionalAttributes =
  | 'id'
  | 'logo'
  | 'created_at'
  | 'updated_at';
export type certificationProvidersCreationAttributes = Optional<
  certificationProvidersAttributes,
  certificationProvidersOptionalAttributes
>;

export class _certification_providers extends Model implements certificationProvidersAttributes {
  id!: number;
  logo?: string;
  label!: string;
  value?: string;
  created_at!: Date;
  updated_at!: Date;
  
  static initModel(sequelize: Sequelize.Sequelize): typeof _certification_providers {
    return _certification_providers.init(
        {
            id: {
              autoIncrement: true,
              type: Sequelize.BIGINT,
              allowNull: false,
              primaryKey: true
            },
            logo: {
              type: Sequelize.STRING,
              allowNull: true,
            },
            label: {
              type: Sequelize.STRING,
              allowNull: false,
              unique: true
            },
            value: {
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
              tableName: '_certification_providers',
              schema: 'public',
              timestamps: true,
              indexes: [
                {
                  name: "_certification_providers_pkey",
                  unique: true,
                  fields: [
                    { name: "id" },
                  ]
                },
                {
                  name: "_certification_providers_label",
                  unique: true,
                  fields: [
                    { name: "label" },
                  ]
                }
              ]
            },
    );
  }
}
