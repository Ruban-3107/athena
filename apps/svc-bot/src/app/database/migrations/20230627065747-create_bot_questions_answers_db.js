'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable(
      'bot_questions_answers',
      {
        id: {
          autoIncrement: true,
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        question: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        answer: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: Date.now()
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      },
      {
        Sequelize,
        tableName: 'bot_questions_answers',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'bot_questions_answers_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    const promises = [];
    promises.push(queryInterface.dropTable('bot_questions_answers'))
    return Promise.all(promises);
  }
};
