import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface domainTechnologyAttributes {
    id: number;
    blob_category?: string;
    name?: string;
    created_at: Date;
    updated_at: Date;
}
export type domainTechnologyPk = 'id';
export type domainTechnologyId = domainTechnology[domainTechnologyPk];
export type domainTechnologyOptionalAttributes =
    | 'id'
    | 'created_at'
    | 'updated_at';
export type domainTechnologyCreationAttributes = Optional<
    domainTechnologyAttributes,
    domainTechnologyOptionalAttributes
>;
export class domainTechnology
    extends Model
    implements domainTechnologyAttributes {
    id!: number;
    blob_category?: string;
    name?: string;
    created_at!: Date;
    updated_at!: Date;

    static initModel(sequelize: Sequelize.Sequelize): typeof domainTechnology {
        return domainTechnology.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                blob_category: {
                    type: Sequelize.ENUM('domain', 'technology'),
                    allowNull: true,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                created_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                updated_at: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: '_domain_technology',
                schema: 'public',
                timestamps: true,
                indexes: [
                    {
                        name: '_domain_technology_pkey',
                        unique: true,
                        fields: [{ name: 'id' }],
                    },
                ],
            }
        );
    }
}
