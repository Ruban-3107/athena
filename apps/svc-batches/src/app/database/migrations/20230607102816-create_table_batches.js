'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('batches', {
      id: {
        autoIncrement: true,
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      started_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      training_facilitator: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      client_representative: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      end_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      deleted_by: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      created_by: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('Upcoming', 'Ongoing', 'On Hold', 'Completed'),
        allowNull: false,
        defaultValue: 'Upcoming'
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
        tableName: 'batches',
        schema: 'public',
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            name: "batches_pkey",
            unique: true,
            fields: [
              { name: "id" },
            ]
          },
        ]
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('batches');
  }
};
