'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.addColumn(
            'User',
            'isActive',
            Sequelize.BOOLEAN
        );
    },

    down: (queryInterface, Sequelize) => {
        queryInterface.removeColumn(
            'User',
            'isActive'
        );
    }
};
