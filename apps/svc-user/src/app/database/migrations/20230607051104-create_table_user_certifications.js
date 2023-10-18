'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_certifications', {
      id: {
        autoIncrement: true,
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      provider_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: '_certification_providers',
          key: 'id'
        }
      },

      certificate_upload: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      date_achieved: {
        type: Sequelize.STRING,
        allowNull: false
      },
      date_expires: {
        type: Sequelize.STRING,
        allowNull: true
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      certification_type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      certification_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      certification_url: {
        type: Sequelize.STRING,
        allowNull: true
      },

      created_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
    },
      {
        Sequelize,
        tableName: 'user_certifications',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: "user_certifications_pkey",
            unique: true,
            fields: [
              { name: "id" }
            ]
          }, {
            name: "index_user_certifications_on_user_id",
            fields: [
              { name: "user_id" },
            ]
          }
        ]
      })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_certifications');
  }
};
