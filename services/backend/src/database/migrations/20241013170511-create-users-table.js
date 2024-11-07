'use strict';

const tableName = 'users';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(tableName, {
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
            },
            abilities: {
                type: Sequelize.JSON,
                allowNull: false,
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable(tableName);
    }
};