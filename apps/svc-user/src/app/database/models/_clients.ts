import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface clientsAttributes {
    id: number;
    corporate_group: string;
    company_name: string;
    primary_email: string;
    primary_contact: string;
    website_url?: string;
    address_line_1?: string;
    address_line_2?: string;
    city?: string;
    state?: string;
    pincode?: number;
    country?: string;
    description?: string;
    contact_details: JSON[];
    created_at: Date;   
    updated_at: Date;
    deleted_at?: Date;
    created_by?: number;
    updated_by?: number;
    is_active: boolean;
    group_id?: string;
}
export type clientsPk = "id";
export type clientsId = _clients[clientsPk];
export type clientsOptionalAttributes = "id" | "website_url" | "address_line_1" | "address_line_2" | "city" | "state" | "pincode" | "country" | "description" | "created_at" | "updated_at";
export type clientsCreationAttributes = Optional<clientsAttributes, clientsOptionalAttributes>;

export class _clients extends Model implements clientsAttributes {
    id!: number;
    corporate_group!: string;
    company_name: string;
    primary_email!: string;
    primary_contact!: string;
    website_url?: string;
    address_line_1?: string;
    address_line_2?: string;
    city?: string;
    state?: string;
    pincode?: number;
    country?: string;
    description?: string;
    contact_details!: JSON[];
    created_at!: Date;
    updated_at!: Date;
    deleted_at?: Date;
    created_by?: number;
    updated_by?: number;
    is_active!: boolean;
    group_id?: string;


    static initModel(sequelize: Sequelize.Sequelize): typeof _clients {
        return _clients.init({
            id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true
            },
            corporate_group: {
                type: DataTypes.STRING,
                allowNull: false
            },
            company_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            contact_details: {
                type: DataTypes.JSONB,
                allowNull: false
            },
            primary_email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            primary_contact: {
                type: DataTypes.STRING,
                allowNull: false
            },
            website_url: {
                type: DataTypes.STRING,
                allowNull: true
            },
            address_line_1: {
                type: DataTypes.STRING,
                allowNull: true
            },
            address_line_2: {
                type: DataTypes.STRING,
                allowNull: true
            },
            city: {
                type: DataTypes.STRING,
                allowNull: true
            },
            state: {
                type: DataTypes.STRING,
                allowNull: true
            },
            pincode: {
                type: DataTypes.BIGINT,
                allowNull: true
            },
            country: {
                type: DataTypes.STRING,
                allowNull: true
            },
            created_by: {
                type: DataTypes.BIGINT,
                allowNull:true
            },
            updated_by: {
                type: DataTypes.BIGINT,
                allowNull:true
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue:true
            },
            group_id: {
                type: DataTypes.STRING,
                allowNull:true
            }
        }, {
            sequelize,
            tableName: '_clients',
            schema: 'public',
            timestamps: true,
            paranoid:true,
            indexes: [
                {
                    name: "_clients_pkey",
                    unique: true,
                    fields: [
                        { name: "id" },
                    ]
                }
            ]
        });
    }
}






