'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                unique: true,
                primaryKey: true,
            },
            login: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            nickname: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            }
        });

        await queryInterface.addColumn('users', 'role_id', {
            type: Sequelize.INTEGER,
            allowNull: false,
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            references: { model: 'roles', key: 'id' }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('users');
    }
};