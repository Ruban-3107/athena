'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_sessions_history', {
      id: {
        autoIncrement: true,
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      field: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      sign_up_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      sign_in_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      sign_out_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      is_email_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      is_password_changed: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      user_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      user_roles: {
        type: Sequelize.JSONB,
        allowNull: true,
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
        tableName: 'user_sessions_history',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'user_sessions_history_pky',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_sessions_history');
  }
};
