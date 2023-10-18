'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('employment_history', {
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
      company: {
        type: Sequelize.STRING,
        allowNull: false
      },
      job_title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      job_description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      start_month: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end_month: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: 0
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
        tableName: 'employment_history',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: "employment_history_pkey",
            unique: true,
            fields: [
              { name: "id" },
            ]
          },
          {
            name: "index_employment_history_on_user_id",
            fields: [
              { name: "user_id" },
            ]
          },
        ]
      })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('employment_history');
  }
};
