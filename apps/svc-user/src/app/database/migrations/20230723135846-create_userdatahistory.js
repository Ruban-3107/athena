'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'userdatahistory',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.BIGINT,
        },
        user_id: {
          allowNull: false,
          type: Sequelize.BIGINT
        },
        user_name: {
          type: Sequelize.STRING,
          allowNull: true,
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
        user_roles: {
          type: Sequelize.JSONB,
          allowNull: true,
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {
        Sequelize,
        tableName: 'userdatahistory',
        schema: 'public',
        timestamps: true,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('userdatahistory')
  }
};
