import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional, NonAttribute } from 'sequelize';
import { chapters, chaptersId } from './chapters';
import { activities_log } from './activities_log';

export interface tracksAttributes {
  id: number;
  slug: string;
  title: string;
  blurb: string;
  repo_url?: string;
  synced_to_git_sha?: string;
  num_exercises: number;
  num_concepts: number;
  tags?: object;
  active: boolean;
  num_students: number;
  median_wait_time?: number;
  created_at: Date;
  updated_at: Date;
  course: boolean;
  has_test_runner: boolean;
  has_representer: boolean;
  has_analyzer: boolean;
  track_type: string;
  image_url?: string;
  status: string;
  deleted_at?: Date;
  created_by?: number;
  updated_by?: number;
  deleted_by?: number;
  level: string;
  permission: string;
  to_be_reviewed_by?: number;
  position?: string;
  reason?: string;
  approved_by?: number;
  approved_at?: Date;
}

export type tracksPk = 'id';
export type tracksId = tracks[tracksPk];
export type tracksOptionalAttributes =
  | 'id'
  | 'num_exercises'
  | 'num_concepts'
  | 'tags'
  | 'active'
  | 'num_students'
  | 'median_wait_time'
  | 'created_at'
  | 'updated_at';
export type tracksCreationAttributes = Optional<
  tracksAttributes,
  tracksOptionalAttributes
>;

export class tracks extends Model implements tracksAttributes {
  id!: number;
  slug!: string;
  title!: string;
  blurb!: string;
  repo_url?: string;
  synced_to_git_sha?: string;
  num_exercises!: number;
  num_concepts!: number;
  tags?: object;
  active!: boolean;
  num_students!: number;
  median_wait_time?: number;
  created_at!: Date;
  updated_at!: Date;
  course!: boolean;
  has_test_runner!: boolean;
  has_representer!: boolean;
  has_analyzer!: boolean;
  track_type!: string;
  image_url: string;
  status!: string;
  deleted_at?: Date;
  created_by?: number;
  updated_by?: number;
  deleted_by?: number;
  level!: string;
  permission!: string;
  to_be_reviewed_by?: number;
  position?: string;
  reason?: string;
  approved_by?: number;
  approved_at?: Date;

  chapters?: NonAttribute<chapters[]>;
  createTrack_chapters!: Sequelize.BelongsToManyCreateAssociationMixin<chapters>;
  getTrack_chapters!: Sequelize.BelongsToManyGetAssociationsMixin<chapters>;
  setTrack_chapters!: Sequelize.BelongsToManySetAssociationsMixin<
    chapters,
    number
  >;

  // tracks?: NonAttribute<tracks[]>;
  createChild!: Sequelize.BelongsToManyCreateAssociationMixin<tracks>;
  getChildren!: Sequelize.BelongsToManyGetAssociationsMixin<tracks>;
  setChildren!: Sequelize.BelongsToManySetAssociationsMixin<tracks, number>;


  static initModel(sequelize: Sequelize.Sequelize): typeof tracks {
    const model = tracks.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        slug: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        blurb: {
          type: DataTypes.STRING(400),
          allowNull: false,
        },
        repo_url: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        synced_to_git_sha: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        num_exercises: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        num_concepts: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        tags: {
          type: DataTypes.JSON,
          allowNull: true,
        },
        active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        num_students: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        median_wait_time: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        course: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        has_test_runner: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        has_representer: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        has_analyzer: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        track_type: {
          type: DataTypes.ENUM('softskill', 'upskill', 'certification', 'NGS'),
          allowNull: false,
          defaultValue: 'NGS',
        },
        status: {
          type: Sequelize.ENUM('Published', 'Pending Approval', 'In Draft', 'Approved', 'Rejected', 'Review In Progress'),
          allowNull: false,
          defaultValue: 'Approved',
        },
        created_by: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        updated_by: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        deleted_by: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        image_url: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        level: {
          type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
          allowNull: false,
          defaultValue: 'Beginner',
        },
        permission: {
          type: DataTypes.ENUM('Public', 'Private'),
          allowNull: false,
          defaultValue: 'Public',
        },
        reason: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        approved_by: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        approved_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        deleted_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        to_be_reviewed_by: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        position: {
          type: DataTypes.TEXT,
          allowNull: true,
          get() {
            let position = [];
            try {
              position = this.getDataValue('position');
            } catch (error) {
              console.log(error);
            }
            return position;
          },
        },
        technology_skills: {
          type: DataTypes.NUMBER,
          references: {
            model: '_domain_technology',
            key: 'id',
          },
          allowNull: true,
        },
        prerequisites: {
          type: Sequelize.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'tracks',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'index_tracks_on_slug',
            unique: true,
            fields: [{ name: 'slug' }],
          },
          {
            name: 'tracks_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );

    tracks.afterCreate((instance, options): any => {
      return activities_log.create({
        module_id: instance.id,
        module_type: this.tableName,
        module_name: instance.title,
        action: 'create',
        user_id: instance.created_by,
      });
    });

    tracks.afterUpdate((instance, options): any => {
      if (instance.changed('status')) {
        return activities_log.create({
          module_id: instance.id,
          module_type: this.tableName,
          module_name: instance.title,
          action: 'approve',
          user_id: instance.created_by,
        });
      }
    });
    return model;
  }
}
