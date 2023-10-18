'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('batch_learners', {
      id: {
        autoIncrement: true,
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false
      },

      batch_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'batches',
          key: 'id'
        }
      },
      created_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    },
      {
        Sequelize,
        tableName: 'batch_learners',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'batch_learners_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('batch_learners');
  }
};
