import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface modulesAttributes {
    id: number;
    name: string;
    menu: string;
    mod_order: number;
}
export type modulesPk = 'id';
export type modulesId = _modules[modulesPk];
export type modulesOptionalAttributes = 'id' | 'name' | 'menu';
export type modulesCreationAttributes = Optional<
    modulesAttributes,
    modulesOptionalAttributes
>;
export class _modules extends Model implements modulesAttributes {
    id!: number;
    name!: string;
    menu!: string;
    mod_order!: number;

    static initModel(sequelize: Sequelize.Sequelize): typeof _modules {
        return _modules.init(
            {
                id: {
                    autoIncrement: true,
                    type: Sequelize.BIGINT,
                    allowNull: false,
                    primaryKey: true
                },
                menu: {
                    type: Sequelize.STRING(30),
                    allowNull: true
                },
                name: {
                    type: Sequelize.STRING(100),
                    allowNull: false,
                    unique: "modules_name_key"
                },
                mod_order: {
                    type: Sequelize.INTEGER,
                    allowNull: true
                },
            }, {
            sequelize,
            tableName: '_modules',
            schema: 'public',
            timestamps: false,
            indexes: [
                {
                    name: "_modules_pkey",
                    unique: true,
                    fields: [
                        { name: "id" },
                    ]
                },
            ]
        }
        );
    }
}
