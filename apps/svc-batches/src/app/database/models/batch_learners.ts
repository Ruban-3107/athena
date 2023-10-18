import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional, NonAttribute } from 'sequelize';

export interface batchLearnersAttributes {
  id: number;
  user_id: number;
  batch_id: number;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
export type batchLearnersPk = 'id';
export type batchLearnersId = batch_learners[batchLearnersPk];
export type batchLearnersOptionalAttributes = 'id' | 'user_id' | 'batch_id';
export type batchLearnersCreationAttributes = Optional<
  batchLearnersAttributes,
  batchLearnersOptionalAttributes
>;
export class batch_learners extends Model implements batchLearnersAttributes {
  id!: number;
  user_id: number;
  batch_id: number;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;

  static initModel(sequelize: Sequelize.Sequelize): typeof batch_learners {
    return batch_learners.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        batch_id: {
          type: DataTypes.BIGINT,
          allowNull: true,
          references: {
            model: 'batches',
            key: 'id',
          },
        },
        created_at: {
          allowNull: true,
          type: DataTypes.DATE,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        deleted_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'batch_learners',
        schema: 'public',
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            name: 'batchLearners_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}
