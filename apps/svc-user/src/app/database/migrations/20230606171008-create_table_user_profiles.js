'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_profiles', {
      id: {
        autoIncrement: true,
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      twitter: {
        type: Sequelize.STRING,
        allowNull: true
      },
      facebook: {
        type: Sequelize.STRING,
        allowNull: true
      },
      github: {
        type: Sequelize.STRING,
        allowNull: true
      },
      linkedin: {
        type: Sequelize.STRING,
        allowNull: true
      },
      medium: {
        type: Sequelize.STRING,
        allowNull: true
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      years_of_experience: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      contact_email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      address_line_1: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address_line_2: {
        type: Sequelize.STRING,
        allowNull: true
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true
      },
      pincode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true
      },
      about_me: {
        type: Sequelize.STRING,
        allowNull: true
      },
      preferences: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      alternate_email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      alternate_phone_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      experience_updated_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      education: {
        type: Sequelize.STRING,
        allowNull: true
      },
      image_url: {
        type: Sequelize.STRING,
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

    },
      {
        Sequelize,
        tableName: 'user_profiles',
        schema: 'public',
        timestamps: true,
        indexes: [
          {
            name: "index_user_profiles_on_user_id",
            unique: true,
            fields: [
              { name: "user_id" },
            ]
          },
          {
            name: "user_profiles_pkey",
            unique: true,
            fields: [
              { name: "id" },
            ]
          },
        ]
      })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_profiles');
  }
};
