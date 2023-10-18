import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional, NonAttribute } from 'sequelize';
import { courses, coursesId } from './courses';
import { topics, topicsId } from './topics';
import { activities_log } from './activities_log';


export interface chaptersAttributes {
    id: number;
    title: string;
    position?: string;
    description?: string;
    slug?: string;
    //  status: number;
    // course_id?: number;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    created_by?: number;
    updated_by?: number;
    deleted_by?: number;
    approved_by?: number;
    approved_at?: Date;
    status: string;
    to_be_reviewed_by?: number;
    level: string;
    reason?: string;

}

export type chaptersPk = "id";
export type chaptersId = chapters[chaptersPk];
export type chaptersOptionalAttributes = "id" | "description" | "slug" | "created_at" | "updated_at";
export type chaptersCreationAttributes = Optional<chaptersAttributes, chaptersOptionalAttributes>;


export class chapters extends Model implements chaptersAttributes {
    id!: number;
    title!: string;
    position?: string;
    description?: string;
    slug?: string;
    //status!: number;
    // course_id?: number;
    created_at!: Date;
    updated_at!: Date;
    deleted_at?: Date;
    created_by?: number;
    updated_by?: number;
    deleted_by?: number;
    approved_by?: number;
    approved_at?: Date;
    status!: string;
    to_be_reviewed_by?: number;
    level!: string;
    reason?: string;


    course!: courses;
    topics?: NonAttribute<topics[]>;

    getCourse!: Sequelize.BelongsToGetAssociationMixin<courses>;
    setCourse!: Sequelize.BelongsToSetAssociationMixin<courses, coursesId>;
    createCourse!: Sequelize.BelongsToCreateAssociationMixin<courses>;

    createChapter_topics!: Sequelize.BelongsToManyCreateAssociationMixin<topics>;
    getChapter_topics!: Sequelize.BelongsToManyGetAssociationsMixin<topics>;
    setChapter_topics!: Sequelize.BelongsToManySetAssociationsMixin<topics, number>;
    addChapter_topics!: Sequelize.BelongsToManyAddAssociationMixin<topics, number>;


    static initModel(sequelize: Sequelize.Sequelize): typeof chapters {
        const model = chapters.init(
            {
            id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true
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
                }
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            slug: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            status:{
                type: Sequelize.ENUM('Published', 'Pending Approval', 'In Draft', 'Approved', 'Rejected', 'Review In Progress'),
                allowNull: false,
                defaultValue: 'Approved',
            },
            created_by: {
                type: DataTypes.BIGINT,
                allowNull: true
            },
            updated_by: {
                type: DataTypes.BIGINT,
                allowNull: true
            },
            deleted_by: {
                type: DataTypes.BIGINT,
                allowNull: true
            },
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            to_be_reviewed_by: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            level: {
                type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
                allowNull: false,
                defaultValue: 'Beginner'
            },
            technology_skills: {
                type: DataTypes.STRING,
                allowNull: true
            },
            reason: {
                type: DataTypes.STRING,
                allowNull:true
              },
            approved_by: {
                type: DataTypes.BIGINT,
                allowNull: true,
            },
            approved_at: {
                type: DataTypes.DATE,
                allowNull: true,
            }

        }, {
            sequelize,
            tableName: 'chapters',
            schema: 'public',
            timestamps: true,
            paranoid: true,
            indexes: [
                {
                    name: "chapters_pkey",
                    unique: true,
                    fields: [
                        { name: "id" },
                    ]
                },
                // {
                //     name: "index_chapters_on_course_id",
                //     fields: [
                //         { name: "course_id" },
                //     ]
                // },
                {
                    name: "index_chapters_on_slug",
                    unique: true,
                    fields: [
                        { name: "slug" },
                    ]
                }
            ]
        });

        chapters.afterCreate((instance, options): any => {
            return activities_log.create({
              module_id: instance.id,
              module_type: this.tableName,
              module_name: instance.title,
              action: 'create',
              user_id: instance.created_by,
            });
          });
      
          chapters.afterUpdate((instance, options): any => {
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