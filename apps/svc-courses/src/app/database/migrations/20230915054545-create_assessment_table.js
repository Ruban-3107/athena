'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('assessments', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      options: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      technology_skills: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false, // Set to false to allow duplicates
      },
      question: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          'Published',
          'Pending Approval',
          'In Draft',
          'Approved',
          'Rejected',
          'Review In Progress'
        ),
        allowNull: false,
        defaultValue: 'Approved',
      },
      created_by: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      approved_by: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      approved_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_by: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      updated_by: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    },{
      Sequelize,
      tableName: 'assessments',
      schema: 'public',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'assessments_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
        
      ],
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('assessments');
  }
};
