import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface user_tracksAttributes {
  id: number;
  user_id: number;
  track_id: number;
  summary_data: string;
  course_summary_data?: string;
  summary_key?: string;
  practice_mode: boolean;
  anonymous_during_mentoring: boolean;
  last_touched_at: Date;
  batch_id?: number;
  objectives?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export type user_tracksPk = 'id';
export type user_tracksId = user_tracks[user_tracksPk];
export type user_tracksOptionalAttributes =
  | 'id'
  | 'summary_key'
  | 'objectives'
  | 'created_at'
  | 'updated_at';
export type user_tracksCreationAttributes = Optional<
  user_tracksAttributes,
  user_tracksOptionalAttributes
>;

export class user_tracks extends Model implements user_tracksAttributes {
  id!: number;
  user_id!: number;
  track_id!: number;
  summary_data!: string;
  course_summary_data?: string;
  summary_key?: string;
  practice_mode!: boolean;
  anonymous_during_mentoring!: boolean;
  last_touched_at!: Date;
  objectives?: string;
  batch_id?: number;
  created_at!: Date;
  updated_at!: Date;
  deleted_at?: Date;

  static initModel(sequelize: Sequelize.Sequelize): typeof user_tracks {
    return user_tracks.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        track_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        batch_id: {
          type: DataTypes.BIGINT,
          allowNull: true,
          references: {
            model: 'batches',
            key: 'id',
          },
        },
        summary_data: {
          type: DataTypes.TEXT,
          allowNull: false,
          get() {
            let summary_data = {};
            try {
              summary_data = JSON.parse(this.getDataValue('summary_data'));
            } catch (error) {
              console.log(error);
            }
            return summary_data;
          },
        },
        course_summary_data: {
          type: DataTypes.TEXT,
          allowNull: true,
          get() {
            let course_summary_data = {};
            try {
              course_summary_data = JSON.parse(
                this.getDataValue('course_summary_data')
              );
            } catch (error) {
              console.log(error);
            }
            return course_summary_data;
          },
        },
        completed_exercises: {
          type: DataTypes.TEXT,

          //   type: DataTypes.VIRTUAL,
          //   get: function () {
          //     let completed_exercises = 0;
          //     try {
          //       let summary_data = JSON.parse(this.getDataValue('summary_data'));
          //     for (const [key, value] of Object.entries(summary_data.exercises)) {
          //         if (value['completed_at']) completed_exercises += 1;
          //       }
          //       this.setDataValue('summary_data', null);
          //     } catch (error) { }
          //     return completed_exercises;
          //   }
        },
        summary_key: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        practice_mode: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        anonymous_during_mentoring: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        last_touched_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        objectives: {
          type: DataTypes.TEXT,
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
        deleted_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'user_tracks',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'index_user_tracks_on_track_id',
            fields: [{ name: 'track_id' }],
          },
          {
            name: 'index_user_tracks_on_user_id',
            fields: [{ name: 'user_id' }],
          },
          {
            name: 'index_user_tracks_on_user_id_and_track_id',
            unique: true,
            fields: [{ name: 'user_id' }, { name: 'track_id' }],
          },
          {
            name: 'user_tracks_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}
