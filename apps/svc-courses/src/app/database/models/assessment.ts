import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface assessmentsAttribute {
  id: number;
  title?: string;
  options?: string;
  question?: string;
  technology_skills?: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  updated_by?: number;
  deleted_by?: number;
  created_by?: number;
  staus?: string;
  approved_by?: number;
  approved_at?: number;
}

export type assessmentsOptionalAttributs =
  | 'id'
  | 'created_at'
  | 'updated_at'
  | 'deleted_at'
  | 'updated_by'
  | 'deleted_by'
  | 'created_by'
  | 'approved_by'
  | 'approved_at';

export type assessmentCreationAttributes = Optional<
  assessmentsAttribute,
  assessmentsOptionalAttributs
>;

export class assessments extends Model implements assessmentsAttribute {
  id!: number;
  title?: string;
  options?: string;
  question?: string;
  technology_skills?: number;
  created_at!: Date;
  updated_at!: Date;
  deleted_at?: Date;
  updated_by?: number;
  deleted_by?: number;
  created_by?: number;
  staus?: string;
  approved_by?: number;
  approved_at?: number;

  static initModel(sequelize: Sequelize.Sequelize): typeof assessments {
    return assessments.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        options: {
          type: DataTypes.JSONB, // change the data type to JSONB
          allowNull: true,
        },
        technology_skills: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique:false
        },
        question: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM(
            'Published',
            'Pending Approval',
            'In Draft',
            'Approved',
            'Rejected',
            'Review In Progress'
          ),
          allowNull: false,
          defaultValue: 'Approved',
        },
        created_by: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        approved_by: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        approved_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        deleted_by: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        updated_by: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'assessments',
        schema: 'public',
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            name: 'assessments_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          
        ],
      }
    );
  }
}
