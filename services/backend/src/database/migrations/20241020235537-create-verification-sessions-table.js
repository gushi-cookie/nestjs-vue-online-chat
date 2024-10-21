'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('verification_sessions', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                unique: true,
                primaryKey: true,
            },
            token: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            data: {
                type: Sequelize.JSON,
                allowNull: false,
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                field: 'created_at',
            }
        });

        await queryInterface.addColumn('verification_sessions', 'user_id', {
            type: Sequelize.INTEGER,
            allowNull: false,
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            references: { model: 'users', key: 'id' }
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('verification_sessions');
    }
};