'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable('_domain_technology', {
        id: {
          autoIncrement: true,
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        blob_category: {
          type: Sequelize.ENUM('domain', 'technology'),
          allowNull: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        created_at: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        updated_at: {
          allowNull: true,
          type: Sequelize.DATE,
        },

      },
        {
          Sequelize,
          tableName: '_domain_technology',
          schema: 'public',
          timestamps: true,
          indexes: [
            {
              name: '_domain_technology_pkey',
              unique: true,
              fields: [{ name: 'id' }],
            },
          ],
        }
      );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('_domain_technology');
  }
};
