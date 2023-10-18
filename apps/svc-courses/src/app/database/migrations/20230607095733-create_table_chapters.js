    'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('chapters',
      {
          id: {
              autoIncrement: true,
              type: Sequelize.BIGINT,
              allowNull: false,
              primaryKey: true
          },
          title: {
              type: Sequelize.STRING,
              allowNull: false,
          },
          position: {
              type: Sequelize.TEXT,
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
              type: Sequelize.STRING,
              allowNull: true,
          },
          slug: {
              type: Sequelize.STRING,
              allowNull: true,
          },
          status: {
              type: Sequelize.STRING,
              allowNull: false,
          },
          created_by: {
              type: Sequelize.BIGINT,
              allowNull: true
          },
          updated_by: {
              type: Sequelize.BIGINT,
              allowNull: true
          },
          deleted_by: {
              type: Sequelize.BIGINT,
              allowNull: true
          },
          deleted_at: {
              type: Sequelize.DATE,
              allowNull: true,
          },
          to_be_reviewed_by: {
              type: Sequelize.INTEGER,
              allowNull: true
          },
          level: {
              type: Sequelize.ENUM('Beginner', 'Intermediate', 'Advanced'),
              allowNull: false,
              defaultValue: 'Beginner'
          },
          technology_skills: {
              type: Sequelize.STRING,
              allowNull: true
          },
          reason: {
              type: Sequelize.STRING,
              allowNull:true
            },
          approved_by: {
              type: Sequelize.INTEGER,  
              allowNull: true,
              
          },
          approved_at: {
              type: Sequelize.DATE,
              allowNull: true,
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE
        }
      },{
        Sequelize,
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
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('chapters');
  }
};
