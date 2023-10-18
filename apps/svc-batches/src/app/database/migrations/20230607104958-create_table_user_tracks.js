'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_tracks', {
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
      track_id: {
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
      summary_data: {
        type: Sequelize.TEXT,
        allowNull: false,
        get() {
          let summary_data = {};
          try {
            summary_data = JSON.parse(this.getDataValue('summary_data'));
          } catch (error) { console.log(error) }
          return summary_data;
        }
      },
      course_summary_data: {
        type: Sequelize.TEXT,
        allowNull: true,
        get() {
          let course_summary_data = {};
          try {
            course_summary_data = JSON.parse(this.getDataValue('course_summary_data'));
          } catch (error) { console.log(error) }
          return course_summary_data;
        }
      },
      completed_exercises: {
        type: Sequelize.TEXT,
        // get: function () { 
        //   let completed_exercises = 0;
        //   try {
        //     let summary_data = JSON.parse(this.getDataValue('summary_data'));
        //   for (const [key, value] of Object.entries(summary_data.exercises)) {
        //       if (value['completed_at']) completed_exercises += 1;
        //     }
        //     this.setDataValue('summary_data', null);
        //   } catch (error) { }
        //   return completed_exercises;
        // }
      },
      summary_key: {
        type: Sequelize.STRING,
        allowNull: true
      },
      practice_mode: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      anonymous_during_mentoring: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      last_touched_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      objectives: {
        type: Sequelize.TEXT,
        allowNull: true
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
        tableName: 'user_tracks',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: "index_user_tracks_on_track_id",
            fields: [
              { name: "track_id" },
            ]
          },
          {
            name: "index_user_tracks_on_user_id",
            fields: [
              { name: "user_id" },
            ]
          },
          {
            name: "index_user_tracks_on_user_id_and_track_id",
            unique: true,
            fields: [
              { name: "user_id" },
              { name: "track_id" },
            ]
          },
          {
            name: "user_tracks_pkey",
            unique: true,
            fields: [
              { name: "id" },
            ]
          },
        ]
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_tracks');
  }
};
