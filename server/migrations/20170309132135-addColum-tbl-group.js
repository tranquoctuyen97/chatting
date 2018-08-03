'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.addColumn(
            'Group',
            'type',
             Sequelize.ENUM('private', 'group')

        );
    },

    down: (queryInterface, Sequelize) => {
        queryInterface.removeColumn(
            'Group',
            'type',
               Sequelize.STRING

        );
    }
};
