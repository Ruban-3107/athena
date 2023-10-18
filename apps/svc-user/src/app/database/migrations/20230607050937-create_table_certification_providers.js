'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('_certification_providers', {
      id: {
        autoIncrement: true,
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      logo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      label: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      value: {
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
    },
      {
        Sequelize,
        tableName: '_certification_providers',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: "_certification_providers_pkey",
            unique: true,
            fields: [
              { name: "id" },
            ]
          },
          {
            name: "_certification_providers_label",
            unique: true,
            fields: [
              { name: "label" },
            ]
          }
        ]
      })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('_certification_providers');
  }
};
