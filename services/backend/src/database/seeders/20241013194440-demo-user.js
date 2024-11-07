'use strict';

const tableName = 'users';
const login = 'test-user-bla-bla';
const email = 'test-email@gmail.com';
const password = 'pass';
const abilities = {
    groups: ['default'],
    permissions: [],
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(tableName, [{
            login,
            nickname: 'hola-pepega',
            password,
            email,
            verified: true,
            abilities: JSON.stringify(abilities),
        }]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete(tableName, [{ login }]);
    }
};