'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      email: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      sms: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      whats_app: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      notifications_for: {
        type: Sequelize.JSONB, // change the data type to JSONB
        allowNull: true, // set allowNull to true
        defaultValue: {
          type: 'all', // set default value as an object
          value: null
        }
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
        tableName: 'notifications',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: "notifications_pkey",
            unique: true,
            fields: [
              { name: "id" },
            ]
          },
          {
            name: 'index_notifications_on_user_id',
            fields: [{ name: 'user_id' }],
          },
        ]
      }
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('notifications');
  }
};
