import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional, NonAttribute } from 'sequelize';

export interface batchesAttributes {
  id: number;
  name: string;
  description: string;
  client_id: number;
  started_at: Date;
  end_at?: Date;
  created_at: Date;
  updated_at?: Date;
  client_representative?: number;
  training_facilitator?: number;
  deleted_by?: string;
  created_by?: string;
  deleted_at?: Date;
  status: string;
  meeting_link?: string;
  event_id?: string;
}
export type batchesPk = 'id';
export type batchesId = batches[batchesPk];
export type batchesOptionalAttributes =
  | 'id'
  | 'name'
  | 'description'
  | 'started_at';
export type batchesCreationAttributes = Optional<
  batchesAttributes,
  batchesOptionalAttributes
>;
export class batches extends Model implements batchesAttributes {
  id!: number;
  name!: string;
  description!: string;
  started_at!: Date;
  created_at: Date;
  updated_at?: Date;
  client_id!: number;
  end_at?: Date;
  client_representative?: number;
  training_facilitator?: number;
  deleted_by?: string;
  created_by?: string;
  deleted_at?: Date;
  status: string;
  meeting_link?: string;
  event_id?: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof batches {
    return batches.init(
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
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        started_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        client_id: {
          type: DataTypes.INTEGER,
        },
        training_facilitator: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        client_representative: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        end_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        created_by: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        created_at: {
          allowNull: true,
          type: DataTypes.DATE,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        deleted_by: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        deleted_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM('Upcoming', 'Ongoing', 'On Hold', 'Completed'),
          allowNull: false,
          defaultValue: 'Upcoming',
        },
        meeting_link: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: 'Not Yet Scheduled',
        },
        event_id: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: 'Not Yet Scheduled',
        },
      },
      {
        sequelize,
        tableName: 'batches',
        schema: 'public',
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            name: 'batches_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}
