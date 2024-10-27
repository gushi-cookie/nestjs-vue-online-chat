'use strict';

const tableName = 'user_profiles';

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
            profilePictureId: {
                type: Sequelize.STRING,
                allowNull: true,
                field: 'profile_picture_id',
            },
            userId: {
                type: Sequelize.INTEGER,
                field: 'user_id',
                allowNull: false,
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                references: { model: 'users', key: 'id' }
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable(tableName);
    }
};