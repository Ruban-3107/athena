'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const promises = [];

    promises.push(queryInterface.changeColumn ('topics', 'technology_skills', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: '_domain_technology',
        key: 'id'
      }
    }));

    promises.push(queryInterface.changeColumn ('chapters', 'technology_skills', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: '_domain_technology',
        key: 'id'
      }
    }));

    promises.push(queryInterface.changeColumn ('tracks', 'technology_skills', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: '_domain_technology',
        key: 'id'
      }
    }));

    return Promise.all(promises);

  },

  async down (queryInterface, Sequelize) {
   
  }
};
