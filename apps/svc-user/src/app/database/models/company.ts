import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface companyAttributes {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}
export type companyPk = 'id';
export type companyId = company[companyPk];
export type companyOptionalAttributes = 'id' | 'created_at' | 'updated_at';
export type companyCreationAttributes = Optional<
companyAttributes,
companyOptionalAttributes
>;
export class company extends Model implements companyAttributes {
  id!: number;
  name!: string;
  created_at!: Date;
  updated_at!: Date;

  static initModel(sequelize: Sequelize.Sequelize): typeof company {
    return company.init(
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
        }
        
      },

      {
        sequelize,
        tableName: 'company',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'company_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'index_company_on_name',
            unique: true,
            fields: [{ name: 'name' }],
          },
        ],
      }
    );
  }
}
