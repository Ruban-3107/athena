'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('_modules', {
      id: {
        autoIncrement: true,
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      menu: {
        type: Sequelize.STRING(30),
        allowNull: true
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: "modules_name_key"
      },
      mod_order: {
        type: Sequelize.INTEGER,
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
      tableName: '_modules',
      schema: 'public',
      indexes: [
          {
              name: "modules_pkey",
              unique: true,
              fields: [
                  { name: "id" },
              ]
          },
      ]
  })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('_modules');
  }
};
