
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('company', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      }
      
    }, {
      Sequelize,
      tableName: 'company',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: "company_pkey",
          unique: true,
          fields: [
            { name: "id" },
          ]
        },
        {
          name: "index_company_on_name",
          unique:true,
          fields: [
            { name: "name" },
          ]
        },
      ]
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('company');
  }
};
