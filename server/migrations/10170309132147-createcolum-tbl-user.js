'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.addColumn(
            'User',
            'role',
            Sequelize.ENUM('normal', 'admin')
        );
    },

    down: (queryInterface, Sequelize) => {
        queryInterface.removeColumn(
            'User',
            'role'
        );
    }
};
