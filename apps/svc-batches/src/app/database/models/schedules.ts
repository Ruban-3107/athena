import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import moment from 'moment';
import cron from 'node-cron';
import  ScheduleService from '../../service/schedules.service'


export interface schedulesAttributes {
  id: number;
  start_at: Date;
  end_at: Date;
  description?: string;
  topic_id: number;
  trainer_id: number;
  batch_id: number;
  learner_track_id: number;
  learner_id: number;
  track_id: number;
  chapter_id: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  accepted_by?: number;
  accepted_at?: Date;
  declined_by?: number;
  declined_at?: Date;
  cancelled_by?: number;
  cancelled_at?: Date;
  rescheduled_by?: number;
  rescheduled_at?: Date;
  created_by?: number;
  deleted_at?: Date;
  deleted_by?: number;
  reason_for_cancellation?: string;
  schedule_batches?: any;
}

export type schedulesPk = 'id';
export type schedulesId = schedules[schedulesPk];
export type schedulesOptionalAttriutes =
  | 'id'
  | 'start_at'
  | 'end_at'
  | 'description'
  | 'topic_id'
  | 'batch_id'
  | 'created_at'
  | 'updated_at';
export type schedulesCreationAttributes = Optional<
  schedulesAttributes,
  schedulesOptionalAttriutes
>;

export class schedules extends Model implements schedulesAttributes {
  id!: number;
  start_at!: Date;
  end_at!: Date;
  description?: string;
  topic_id!: number;
  trainer_id!: number;
  batch_id!: number;
  learner_id: number;
  track_id!: number;
  chapter_id!: number;
  status: string;
  learner_track_id!: number;
  created_at!: Date;
  updated_at!: Date;
  accepted_by!: number;
  accepted_at!: Date;
  declined_by!: number;
  declined_at!: Date;
  cancelled_by!: number;
  cancelled_at!: Date;
  rescheduled_by!: number;
  rescheduled_at!: Date;
  created_by!: number;
  deleted_at!: Date;
  deleted_by!: number;
  reason_for_cancellation!: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof schedules {
    const model = schedules.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        start_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        end_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        topic_id: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        trainer_id: {
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
        learner_track_id: {
          type: Sequelize.BIGINT,
          allowNull: true,
          references: {
            model: 'user_tracks',
            key: 'id',
          },
        },
        learner_id: {
          type: Sequelize.BIGINT,
          allowNull: true,
        },
        track_id: {
          type: Sequelize.BIGINT,
          allowNull: true,
        },
        chapter_id: {
          type: Sequelize.BIGINT,
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM(
            'pending',
            'scheduled',
            'cancelled',
            'declined',
            'completed',
            'rescheduled',
            'under rescheduling'
          ),
          allowNull: false,
          defaultValue: 'pending',
        },
        unique_id: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        accepted_by: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        accepted_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        declined_by: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        declined_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        rescheduled_by: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        rescheduled_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        cancelled_by: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        cancelled_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        created_by: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        deleted_by: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        created_at: {
          allowNull: true,
          type: DataTypes.DATE,
        },
        deleted_at: {
          allowNull: true,
          type: DataTypes.DATE,
        },
        updated_at: {
          allowNull: true,
          type: DataTypes.DATE,
        },
        reason_for_cancellation: {
          type: Sequelize.STRING,
          allowNull: true,
        },
      },

      
      

      {
        sequelize,
        tableName: 'schedules',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'schedules_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      },
      
    );
    

    return model;
  }
}
