'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    let promises=[];
 
    promises.push(queryInterface.addColumn('notifications', 'viewed', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
          defaultValue: false,
    }));
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
