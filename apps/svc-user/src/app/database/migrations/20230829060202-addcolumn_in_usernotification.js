'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   let promises=[];
    promises.push(queryInterface.addColumn('user_notification','created_at',{
      type:Sequelize.DATE,
      allowNull:false
         
    }))
    promises.push(queryInterface.addColumn('user_notification','updated_at',{
      type:Sequelize.DATE,
      allowNull:false
         
    }))

    return Promise.all(promises)

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
