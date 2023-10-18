'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('_clients', {
      id: {
        autoIncrement: true,
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      corporate_group: {
        type: Sequelize.STRING,
        allowNull: false
      },
      company_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      contact_details: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      primary_email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      primary_contact: {
        type: Sequelize.STRING,
        allowNull: false
      },
      website_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address_line_1: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address_line_2: {
        type: Sequelize.STRING,
        allowNull: true
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true
      },
      pincode: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true
      },
      created_by: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      updated_by: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      group_id: {
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
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      }


    },
      {
        Sequelize,
        tableName: '_clients',
        schema: 'public',
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            name: "clients_pkey",
            unique: true,
            fields: [
              { name: "id" },
            ]
          }
        ]
      })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('_clients');
  }
};
