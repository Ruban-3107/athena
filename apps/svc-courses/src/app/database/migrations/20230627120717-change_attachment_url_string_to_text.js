'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.changeColumn('tracks', 'image_url', {
      type: Sequelize.TEXT,
      allowNull: true, // Update the allowNull value based on your requirements
    });

  },

  async down(queryInterface, Sequelize) {
    queryInterface.changeColumn('tracks', 'image_url', {
      type: Sequelize.STRING,
      allowNull: true, // Update the allowNull value based on your requirements
    });

  }
};
