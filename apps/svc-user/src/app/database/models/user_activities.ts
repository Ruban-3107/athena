import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
// import type { exercises, exercisesId } from './exercises';
// import type { solutions, solutionsId } from './solutions';
// import type { tracks, tracksId } from './tracks';
import type { users, usersId } from './users';

export const TYPES = {
  STARTED: 'User::Activities::StartedExerciseActivity',
  SUBMITTED: 'User::Activities::SubmittedIterationActivity',
  COMPLETED: 'User::Activities::CompletedExerciseActivity',
  PUBLISHED: 'User::Activities::PublishedExerciseActivity',
};

export interface userActivitiesAttributes {
  id: number;
  type: string;
  user_id: number;
  track_id?: number;
  exercise_id?: number;
  solution_id?: number;
  params: string;
  occurred_at: Date;
  uniqueness_key: string;
  version: number;
  rendering_data_cache: string;
  created_at: Date;
  updated_at: Date;
}

export type userActivitiesPk = "id";
export type userActivitiesId = user_activities[userActivitiesPk];
export type userActivitiesOptionalAttributes = "id" | "track_id" | "exercise_id" | "solution_id" | "created_at" | "updated_at";
export type userActivitiesCreationAttributes = Optional<userActivitiesAttributes, userActivitiesOptionalAttributes>;

export class user_activities extends Model implements userActivitiesAttributes {
  id!: number;
  type!: string;
  user_id!: number;
  track_id?: number;
  exercise_id?: number;
  solution_id?: number;
  params!: string;
  occurred_at!: Date;
  uniqueness_key!: string;
  version!: number;
  rendering_data_cache!: string;
  created_at!: Date;
  updated_at!: Date;

  // userActivities belongsTo exercises via exercise_id
  // exercise!: exercises;
  // getExercise!: Sequelize.BelongsToGetAssociationMixin<exercises>;
  // setExercise!: Sequelize.BelongsToSetAssociationMixin<exercises, exercisesId>;
  // createExercise!: Sequelize.BelongsToCreateAssociationMixin<exercises>;
  // // userActivities belongsTo solutions via solution_id
  // solution!: solutions;
  // getSolution!: Sequelize.BelongsToGetAssociationMixin<solutions>;
  // setSolution!: Sequelize.BelongsToSetAssociationMixin<solutions, solutionsId>;
  // createSolution!: Sequelize.BelongsToCreateAssociationMixin<solutions>;
  // // userActivities belongsTo tracks via track_id
  // track!: tracks;
  // getTrack!: Sequelize.BelongsToGetAssociationMixin<tracks>;
  // setTrack!: Sequelize.BelongsToSetAssociationMixin<tracks, tracksId>;
  // createTrack!: Sequelize.BelongsToCreateAssociationMixin<tracks>;
  // userActivities belongsTo users via user_id
  user!: users;
  getUser!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof user_activities {
    return user_activities.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    track_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'tracks',
        key: 'id'
      }
    },
    exercise_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'exercises',
        key: 'id'
      }
    },
    solution_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'solutions',
        key: 'id'
      }
    },
    params: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    occurred_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    uniqueness_key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rendering_data_cache: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'user_activities',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "index_user_activities_on_exercise_id",
        fields: [
          { name: "exercise_id" },
        ]
      },
      {
        name: "index_user_activities_on_solution_id",
        fields: [
          { name: "solution_id" },
        ]
      },
      {
        name: "index_user_activities_on_track_id",
        fields: [
          { name: "track_id" },
        ]
      },
      {
        name: "index_user_activities_on_uniqueness_key",
        unique: true,
        fields: [
          { name: "uniqueness_key" },
        ]
      },
      {
        name: "index_user_activities_on_user_id",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "user_activities_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
