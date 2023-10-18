'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tracks',
      {
        id: {
          autoIncrement: true,
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        slug: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        blurb: {
          type: Sequelize.STRING(400),
          allowNull: false,
        },
        repo_url: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        synced_to_git_sha: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        num_exercises: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        num_concepts: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        tags: {
          type: Sequelize.JSON,
          allowNull: true,
        },
        active: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        num_students: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        median_wait_time: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        course: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        has_test_runner: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        has_representer: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        has_analyzer: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        track_type: {
          type: Sequelize.ENUM('softskill', 'upskill', 'certification', 'NGS'),
          allowNull: false,
          defaultValue: 'NGS',
        },
        status: {
          type: Sequelize.ENUM('Published', 'Pending Approval', 'In Draft'),
          allowNull: false,
          defaultValue: 'Approved',
        },
        created_by: {
          type: Sequelize.BIGINT,
          allowNull: true,
        },
        updated_by: {
          type: Sequelize.BIGINT,
          allowNull: true,
        },
        deleted_by: {
          type: Sequelize.BIGINT,
          allowNull: true,
        },
        image_url: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        level: {
          type: Sequelize.ENUM('Beginner', 'Intermediate', 'Advanced'),
          allowNull: false,
          defaultValue: 'Beginner',
        },
        permission: {
          type: Sequelize.ENUM('Public', 'Private'),
          allowNull: false,
          defaultValue: 'Public',
        },
        reason: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        approved_by: {
          type: Sequelize.BIGINT,
          allowNull: true,
        },
        approved_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        deleted_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        to_be_reviewed_by: {
          type: Sequelize.INTEGER,
          allowNull: true,
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
        technology_skills: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        prerequisites: {
          type: Sequelize.STRING,
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
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tracks');
  }
};
