import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface userdatahistoryAttributes {
    id: number;
    user_id: number;
    sign_up_at: Date;
    is_email_verified: boolean;
    is_password_changed: boolean;
    started_at: Date;
    updated_at: Date;
    user_name: string;
    user_roles: string[];
}
export type userdatahistoryPk = 'id';
export type skillsetId = userdatahistory[userdatahistoryPk];
export type userdatahistoryOptionalAttributes =
    | 'id'
    | 'started_at'
    | 'updated_at';
export type userdatahistoryCreationAttributes = Optional<
    userdatahistoryAttributes,
    userdatahistoryOptionalAttributes
>;

export class userdatahistory
    extends Model
    implements userdatahistoryAttributes {
    id!: number;
    user_id!: number;
    sign_up_at!: Date;
    is_email_verified!: boolean;
    is_password_changed!: boolean;
    started_at: Date;
    updated_at: Date;
    user_name!: string;
    user_roles!: string[];

    static initModel(sequelize: Sequelize.Sequelize): typeof userdatahistory {
        return userdatahistory.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.BIGINT,
                    allowNull: false,
                    primaryKey: true,
                },
                user_id: {
                    allowNull: false,
                    type: Sequelize.BIGINT,
                    references: {
                        model: 'users',
                        key: 'id',
                    },
                },
                field: {
                    allowNull: false,
                    type: Sequelize.STRING,
                },
                sign_up_at: {
                    type: Sequelize.DATE,
                    allowNull: true,
                },
                sign_in_at: {
                    type: Sequelize.DATE,
                    allowNull: true,
                },
                sign_out_at: {
                    type: Sequelize.DATE,
                    allowNull: true,
                },
                is_email_verified: {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                },
                is_password_changed: {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                },
                user_name: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                user_roles: {
                    type: Sequelize.JSONB,
                    allowNull: true,
                },
                // started_at: {
                //     allowNull: false,
                //     type: Sequelize.DATE,
                //     }
                // updated_at: {
                //     allowNull: true,
                //     type: Sequelize.DATE,
                //   },
            },
            {
                sequelize,
                tableName: 'userdatahistory',
                schema: 'public',
                timestamps: true,
                indexes: [
                    {
                        name: 'userdatahistory_pky',
                        unique: true,
                        fields: [{ name: 'id' }],
                    },
                ],
            }
        );
    }
}
