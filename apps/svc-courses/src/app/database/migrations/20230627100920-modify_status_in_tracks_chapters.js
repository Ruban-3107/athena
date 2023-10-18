'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const promises = [];
    // promises.push(
    //   queryInterface.sequelize.query(
    //     "ALTER TYPE enum_tracks_status ADD VALUE 'Review In Progress'"
    //   )
    // );
    // promises.push(
    //   queryInterface.sequelize.query(
    //     "ALTER TYPE enum_tracks_status ADD VALUE 'Approved'"
    //   )
    // );
    // promises.push(
    //   queryInterface.sequelize.query(
    //     "ALTER TYPE enum_tracks_status ADD VALUE 'Rejected'"
    //   )
    // );;
    promises.push(queryInterface.removeColumn('chapters', 'status'));
    promises.push(queryInterface.addColumn('chapters', 'status', {
      type: Sequelize.ENUM('Pending Approval', 'Published', 'In Draft', 'Review In Progress', 'Approved', 'Rejected'),
      allowNull: false,
          defaultValue: 'Pending Approval',
    }));
    return Promise.all(promises);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
