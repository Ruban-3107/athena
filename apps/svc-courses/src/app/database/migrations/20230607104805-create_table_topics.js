'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('topics',
      {
        id: {
          autoIncrement: true,
          type: Sequelize.INTEGER,
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
          type: Sequelize.INTEGER,
          allowNull: true,
          //primaryKey: true,
        },
        topic_link: {
          type: Sequelize.STRING,
          allowNull: true,
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
          },
        },
        status: {
          type: Sequelize.ENUM('Published', 'Pending Approval', 'In Draft', 'Approved', 'Rejected', 'Review In Progress'),
          allowNull: false,
          defaultValue: 'Approved',
        },
        description: {
          type: Sequelize.STRING,
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
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        approved_by: {
          type: Sequelize.BIGINT,
          allowNull: true,
        },
        approved_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        deleted_by: {
          type: Sequelize.BIGINT,
          allowNull: true,
        },
        updated_by: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        deleted_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        same_day: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        version: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '',
        },
        unique_topic_id: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '',
        },
        is_edited: {
          type: Sequelize.BOOLEAN,
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
          allowNull: true
        },
        attachment_pdf_url: {
          type: Sequelize.TEXT,
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
      }, {
      Sequelize,
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
        // {
        //     name: "index_topics_on_chapter_id",
        //     fields: [
        //       { name:"chapter_id" },
        //     ]
        //   }
      ],
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('topics');
  }
};
