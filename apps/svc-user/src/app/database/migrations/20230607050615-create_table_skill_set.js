'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('_skill_set', {
      id: {
        autoIncrement: true,
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true
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
        tableName: '_skill_set',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: "_skill_set_pkey",
            unique: true,
            fields: [
              { name: "id" },
            ]
          },
          {
            name: "_skill_set_label",
            unique: true,
            fields: [
              { name: "label" },
            ]
          }
        ]
      })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('_skill_set');
  }
};
