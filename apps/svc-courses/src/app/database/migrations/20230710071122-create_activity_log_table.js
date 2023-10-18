'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('activities_log',
    {
      id: {
        autoIncrement: true,
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      module_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      module_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      module_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      action: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
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
    },
    {
      Sequelize,
      tableName: 'activities_log',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'activities_log_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('activities_log')
  }
};
