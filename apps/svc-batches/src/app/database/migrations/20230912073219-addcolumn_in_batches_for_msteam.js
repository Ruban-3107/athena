'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const promises = [];

    promises.push(queryInterface.addColumn('batches', 'meeting_link', {


      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'Not Yet Scheduled',


    }))
    promises.push(queryInterface.addColumn('batches', 'event_id', {


      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'Not Yet Scheduled',


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
