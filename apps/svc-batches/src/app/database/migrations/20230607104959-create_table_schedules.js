'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('schedules', {
      id: {
        autoIncrement: true,
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      start_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      topic_id: {
        type: Sequelize.BIGINT,
        allowNull: true,

      },
      trainer_id: {
        type: Sequelize.BIGINT,
        allowNull: true,

      },
      batch_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'batches',
          key: 'id'
        }
      },
      learner_track_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'user_tracks',
          key: 'id',
        },
      },
      learner_id: {
        type: Sequelize.BIGINT,
        allowNull: true,

      },
      track_id: {
        type: Sequelize.BIGINT,
        allowNull: true,

      },
      chapter_id: {
        type: Sequelize.BIGINT,
        allowNull: true,

      },
      status: {
        type: Sequelize.ENUM(
          'pending',
          'scheduled',
          'cancelled',
          'declined',
          'completed',
          'rescheduled',
          'under rescheduling'
        ),
        allowNull: false,
        defaultValue: 'pending',
      },
      unique_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      accepted_by: {
        type: Sequelize.BIGINT,
        allowNull: true,

      },
      accepted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      declined_by: {
        type: Sequelize.BIGINT,
        allowNull: true,

      },
      declined_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      rescheduled_by: {
        type: Sequelize.BIGINT,
        allowNull: true,

      },
      rescheduled_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      cancelled_by: {
        type: Sequelize.BIGINT,
        allowNull: true,

      },
      cancelled_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_by: {
        type: Sequelize.BIGINT,
        allowNull: true,

      },
      deleted_by: {
        type: Sequelize.BIGINT,
        allowNull: true,

      },
      reason_for_cancellation: {
        type: Sequelize.STRING,
        allowNull: true,
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
        tableName: 'schedules',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'schedules_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: "index_schedules_on_batch_id_and_user_track_id",
            unique: true,
            fields: [
              { name: "batch_id" },
              { name: "learner_track_id" },
            ]
          }
        ],
      });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('schedules');
  }
};
