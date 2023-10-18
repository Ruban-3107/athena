'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const promises = [];
    promises.push(queryInterface.addColumn('assessments', 'approved_by', {
      type: Sequelize.BIGINT,
      allowNull: true,
    }))
    promises.push(queryInterface.addColumn('assessments', 'approved_at', {
      type: Sequelize.DATE,
      allowNull: true,
    }))
    return Promise.all(promises);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
