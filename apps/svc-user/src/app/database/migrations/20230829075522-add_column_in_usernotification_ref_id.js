'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    let promises=[];

    promises.push(queryInterface.addColumn('user_notification','user_id',{
      type:Sequelize.BIGINT,
    }))
    promises.push(queryInterface.addColumn('user_notification','ref_id',{
      type:Sequelize.STRING
    }))

    Promise.all(promises);
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
