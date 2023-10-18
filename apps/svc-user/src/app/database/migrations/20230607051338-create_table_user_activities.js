'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_activities', {
      id: {
        autoIncrement: true,
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      module_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      module_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      module_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      action: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
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
        tableName: 'user_activities',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'user_activities_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_activities');
  }
};
