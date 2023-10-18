'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let promises = [];

    promises.push(queryInterface.addColumn('assessments', 'created_at', {

      type: Sequelize.DATE,
      allowNull: true,

    }))
    promises.push(queryInterface.addColumn('assessments', 'updated_at', {

      type: Sequelize.DATE,
      allowNull: true,

    }))
    promises.push(queryInterface.addColumn('assessments', 'deleted_at', {

      type: Sequelize.DATE,
      allowNull: true,

    }))
    return Promise.all(promises)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
