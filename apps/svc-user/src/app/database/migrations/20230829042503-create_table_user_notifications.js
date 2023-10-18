'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_notification',{
      id: {
        autoIncrement: true,
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      notifications_for: {
        type: Sequelize.JSONB, // change the data type to JSONB
        allowNull: false // set allowNull to true
      },
      viewed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      unique_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_by: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_ids: {
        type: Sequelize.JSONB,
        allowNull: false,
      },

    },
    {

      Sequelize,
      tableName: 'user_notification',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'index_unique_id',
          unique: true,
          fields: [{ name: 'unique_id' }],
        },
        
    
        {
          name: 'users_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],

    }
    )
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_notification');
  }
};