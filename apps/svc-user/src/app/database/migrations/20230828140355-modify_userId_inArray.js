'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const promises=[];

    promises.push(queryInterface.changeColumn ('notifications', 'user_id',
    {
      type: Sequelize.JSONB,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
    ))
   
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
