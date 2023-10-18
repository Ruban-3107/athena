'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const promises = [];

    promises.push(queryInterface.addColumn('assessments', 'status', {

      type: Sequelize.ENUM('Published', 'Pending Approval', 'In Draft', 'Approved', 'Rejected', 'Review In Progress'),
      allowNull: false,
      defaultValue: 'Approved',

    }))
    promises.push(queryInterface.addColumn('assessments', 'updated_by', {
      type: Sequelize.BIGINT,
      allowNull: true,
    }))
    promises.push(queryInterface.addColumn('assessments', 'created_by', {
      type: Sequelize.BIGINT,
      allowNull: true,
    }))
    promises.push(queryInterface.addColumn('assessment', 'deleted_by', {
      type: Sequelize.BIGINT,
      allowNull: true,
    }))

    return Promise.all(promises);
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
