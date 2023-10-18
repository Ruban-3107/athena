'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('_roles', {
      id: {
        autoIncrement: true,
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      permissions: {
        type: Sequelize.TEXT,
        allowNull: true,
        get() {
          let permissions = [];
          try {
            permissions = this.getDataValue('permissions');
          } catch (error) {
            console.log(error);
          }
          return permissions;
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
        tableName: '_roles',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: 'roles_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'index_roles_on_name',
            unique: true,
            fields: [{ name: 'name' }],
          },
        ],
      })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('_roles');
  }
};
