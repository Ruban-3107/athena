/**As of now didn't use this model
 * courses nothing but a tracks 
 * for courses too using the tracks model
 */


import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional, NonAttribute } from 'sequelize';
import { chapters } from './chapters';
import type { topics, topicsId } from './topics';

export interface coursesAttributes {
  id: number;
  title: string;
  description?: string;
  slug: string;
  status?: number;
  created_at: Date;
  updated_at: Date;
}

export type coursesPk = 'id';
export type coursesId = courses[coursesPk];
export type coursesOptionalAttributes =
    | 'id'
    | 'description'
    | 'status'
    | 'created_at'
    | 'updated_at';
export type coursesCreationAttributes = Optional<
  coursesAttributes,
  coursesOptionalAttributes
>;

export class courses extends Model implements coursesAttributes {
  id!: number;
  title!: string;
  description?: string;
  slug!: string;
  status?: number;
  created_at!: Date;
  updated_at!: Date;

  topics?: NonAttribute<topics[]>;
  chapters?: NonAttribute<chapters[]>;
  createCourse_topics!: Sequelize.BelongsToManyCreateAssociationMixin<topics>;
  getCourse_topics!: Sequelize.BelongsToManyGetAssociationsMixin<topics>;
  setCourse_topics!: Sequelize.BelongsToManySetAssociationsMixin<
    topics,
    number
  >; //HasManySetAssociationsMixin
  addCourse_topics!: Sequelize.BelongsToManyAddAssociationMixin<topics, number>;
  // setCourse_topics!: Sequelize.HasManySetAssociationsMixin<topics, number>;
  // addCourse_topics!: Sequelize.HasManyAddAssociationMixin<topics, number>;
  //setCourse_topics!: Sequelize.BelongsToManySetAssociationsMixin<topics>;

  createCourse_chapters!: Sequelize.BelongsToManyCreateAssociationMixin<chapters>;
  getCourse_chapters!: Sequelize.BelongsToManyGetAssociationsMixin<chapters>;
  setCourse_chapters!: Sequelize.BelongsToManySetAssociationsMixin<
    chapters,
    number
  >;
  addCourse_chapters!: Sequelize.BelongsToManyAddAssociationMixin<
    chapters,
    number
  >;

  static initModel(sequelize: Sequelize.Sequelize): typeof courses {
    return courses.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        slug: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.SMALLINT,
        },
        
      },
      {
        sequelize,
        tableName: 'courses',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'index_courses_on_slug',
            unique: true,
            fields: [{ name: 'slug' }],
          },
          {
            name: 'courses_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}
