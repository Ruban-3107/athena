import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { courses, coursesId } from './courses';
import { activities_log } from './activities_log';

export interface topicsAttributes {
  id: number;
  topic_type: string;
  exercise_id?: number;
  title: string;
  position?: string;
  status: string;
  attachment_url?: string;
  topic_link?: string;
  created_by: string;
  updated_by?: string;
  deleted_by?: string;
  deleted_at?: Date;
  approved_by?: number;
  approved_at?: Date;
  delivery_type: string;
  // chapter_id:number;
  description?: string;
  created_at: Date;
  updated_at: Date;
  version: string;
  unique_topic_id: string;
  is_edited?: boolean;
  to_be_reviewed_by?: number;
  level: string;
  technology_skills: string;
  attachment_pdf_url: string;
  reason: string;
  s3_bucket_filekey: Text;
  s3_bucket_pdf_filekey: Text;
}
export type topicsPk = 'id';
export type topicsId = topics[topicsPk];
export type topicsOptionalAttributes =
  | 'id'
  | 'description'
  | 'created_at'
  | 'updated_at';
export type topicsCreationAttributes = Optional<
  topicsAttributes,
  topicsOptionalAttributes
>;

export class topics extends Model implements topicsAttributes {
  id!: number;
  topic_type!: string;
  exercise_id?: number;
  title!: string;
  position?: string;
  status!: string;
  topic_link?: string;
  version!: string;
  // chapter_id!:number;
  description?: string;
  approved_by?: number;
  approved_at?: Date;
  created_at!: Date;
  updated_at!: Date;
  delivery_type!: string;
  attachment_url?: string;
  created_by!: string;
  updated_by?: string;
  deleted_by?: string;
  deleted_at?: Date;
  unique_topic_id!: string;
  is_edited?: boolean;
  to_be_reviewed_by?: number;
  level!: string;
  technology_skills!: string;
  attachment_pdf_url: string;
  reason!: string;
  s3_bucket_filekey: Text;
  s3_bucket_pdf_filekey: Text;

  //topics hasMany courses via courses_id
  courses!: courses[];
  getCourses!: Sequelize.HasManyGetAssociationsMixin<courses>;
  setCourses!: Sequelize.HasManySetAssociationsMixin<courses, coursesId>;
  createCourses!: Sequelize.HasManyCreateAssociationMixin<courses>;

  static initModel(sequelize: Sequelize.Sequelize): typeof topics {
    const model = topics.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        topic_type: {
          type: Sequelize.ENUM(
            'Virtual Class',
            'Self-paced',
            'Classroom',
            'Activity',
            'Topic Link'
          ),
          allowNull: false,
          defaultValue: 'Virtual Class',
        },
        exercise_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          //primaryKey: true,
        },
        topic_link: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
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
        status: {
          type: Sequelize.ENUM(
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
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        duration: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        attachment_url: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        delivery_type: {
          type: Sequelize.ENUM('Reading Material', 'Podcast', 'Video'),
          allowNull: false,
          defaultValue: 'Reading Material',
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
        deleted_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        same_day: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        version: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: '',
        },
        unique_topic_id: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: '',
        },
        is_edited: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        to_be_reviewed_by: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        level: {
          type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
          allowNull: false,
          defaultValue: 'Beginner',
        },
        technology_skills: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        reason: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        attachment_pdf_url: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        s3_bucket_filekey: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        s3_bucket_pdf_filekey: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'topics',
        schema: 'public',
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            name: 'topics_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'topic_name',
            unique: true,
            fields: [{ name: 'title' }],
          },
        ],
      }
    );

    topics.afterCreate((instance, options): any => {
      return activities_log.create({
        module_id: instance.id,
        module_type: this.tableName,
        module_name: instance.title,
        action: 'create',
        user_id: instance.created_by,
      });
    });

    topics.afterUpdate((instance, options): any => {
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
