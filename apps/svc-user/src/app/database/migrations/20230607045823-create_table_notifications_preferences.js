'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('_notifications_preferences', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      notification_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
        tableName: '_notification_preference',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: '_notification_preference_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('_notifications_preferences');
  }
};
