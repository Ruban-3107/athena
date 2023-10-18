'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const promises=[];
    promises.push(queryInterface.addColumn('notifications', 'user_ids', {
      type: Sequelize.JSONB,
      allowNull: false,
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
