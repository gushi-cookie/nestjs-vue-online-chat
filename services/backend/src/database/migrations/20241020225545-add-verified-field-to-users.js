'use strict';

const tableName = 'users';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn(tableName, 'verified', {
            allowNull: false,
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn(tableName, 'verified');
    }
};