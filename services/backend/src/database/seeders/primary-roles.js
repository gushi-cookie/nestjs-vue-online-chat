'use strict';


const roles = [
  { id: 1, name: 'administrator' }, 
  { id: 2, name: 'moderator' },
  { id: 3, name: 'user' },
];


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.bulkInsert('roles', roles);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', {
      id: { [Sequelize.Op.or]: roles.map((val) => val.id) }
    });
  }
};
