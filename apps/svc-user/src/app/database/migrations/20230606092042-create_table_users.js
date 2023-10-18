'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      handle: {
        allowNull: false,
        type: Sequelize.STRING
      },
      first_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      provider: {
        allowNull: true,
        type: Sequelize.STRING
      },
      uid: {
        allowNull: true,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: ""
      },
      encrypted_password: {
        allowNull: true,
        type: Sequelize.STRING
      },
      reset_password_token: {
        allowNull: true,
        type: Sequelize.STRING
      },
      reset_password_sent_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      remember_created_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      confirmation_token: {
        allowNull: true,
        type: Sequelize.STRING
      },
      confirmed_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      confirmation_sent_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      unconfirmed_email: {
        allowNull: true,
        type: Sequelize.STRING
      },
      accepted_privacy_policy_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      accepted_terms_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      became_mentor_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      joined_research_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      github_username: {
        allowNull: true,
        type: Sequelize.STRING  
      },
      reputation: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      bio: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      avatar_url: {
        allowNull: true,
        type: Sequelize.STRING
      },
      location: {
        allowNull: true,
        type: Sequelize.STRING
      },
      pronouns: {
        allowNull: true,
        type: Sequelize.STRING
      },
      num_solutions_mentored: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      mentor_satisfaction_percentage: {
        allowNull: true,
        type: Sequelize.SMALLINT
      },
      stripe_customer_id: {
        allowNull: true,
        type: Sequelize.STRING
      },
      total_donated_in_cents: {
        allowNull: true,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      active_donation_subscription: {
        allowNull: true,
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      show_on_supporters_page: {
        allowNull: false,
        defaultValue: true,
        type: Sequelize.BOOLEAN
      },
      client_id: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      roles: {
        allowNull: true,
        type: Sequelize.JSONB
      },
      phone_number: {
        allowNull: true,
        type: Sequelize.STRING
      },
      personal_email: {
        allowNull: true,
        type: Sequelize.STRING
      },
      users_type: {
        allowNull: false,
        defaultValue: "Individual",
        type: Sequelize.STRING
      },
      alternative_phonenumber: {
        allowNull: true,
        type: Sequelize.STRING
      },
      email_confirmed: {
        allowNull: true,
        type: Sequelize.STRING
      },
      last_name: {
        allowNull: true,
        type: Sequelize.STRING
      },
      work_email: {
        allowNull: true,
        type: Sequelize.STRING
      },
      created_by: {
        allowNull: true,
        type: Sequelize.BIGINT
      },
      registration_type: {
        allowNull: false,
        defaultValue: "Platform Registered",
        type: Sequelize.STRING
      },
      athena_id: {
        allowNull: true,
        type: Sequelize.STRING
      },
      resetpassword: {
        allowNull: true,
        type: Sequelize.STRING
      },
      is_password_changed: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      password_updated_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updated_by: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: true,
        type: Sequelize.STRING
      },
      approved_by: {
        allowNull: true,
        type: Sequelize.BIGINT
      },
      is_active: {
        allowNull: false,
        defaultValue: 'active',
        type: Sequelize.ENUM('active', 'in active', 'pending approval')
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
      },
    },
      {

        Sequelize,
        tableName: 'users',
        schema: 'public',
        timestamps: true,
        paranoid: true,
        defaultScope: {
          attributes: {
            exclude: [
              'reset_password_token',
              'confirmation_token',
              'stripe_customer_id',
            ],
          },
        },
        indexes: [
          {
            name: 'index_users_on_confirmation_token',
            unique: true,
            fields: [{ name: 'confirmation_token' }],
          },
          {
            name: 'index_users_on_email',
            unique: true,
            fields: [{ name: 'email' }],
          },
          {
            name: 'index_users_on_github_username',
            unique: true,
            fields: [{ name: 'github_username' }],
          },
          {
            name: 'index_users_on_handle',
            unique: true,
            fields: [{ name: 'handle' }],
          },
          {
            name: 'index_users_on_provider_and_uid',
            unique: true,
            fields: [{ name: 'provider' }, { name: 'uid' }],
          },
          {
            name: 'index_users_on_reset_password_token',
            unique: true,
            fields: [{ name: 'reset_password_token' }],
          },
          {
            name: 'index_users_on_stripe_customer_id',
            unique: true,
            fields: [{ name: 'stripe_customer_id' }],
          },
          {
            name: 'index_users_on_unconfirmed_email',
            fields: [{ name: 'unconfirmed_email' }],
          },
          {
            name: 'users-supporters-page',
            fields: [
              { name: 'total_donated_in_cents' },
              { name: 'show_on_supporters_page' },
            ],
          },
          {
            name: 'users_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],

      });


  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
