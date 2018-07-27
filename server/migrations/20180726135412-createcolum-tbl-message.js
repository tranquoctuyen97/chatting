'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.addColumn(
            'Message',
            'deleted',
            Sequelize.DATE
        );
    },

    down: (queryInterface, Sequelize) => {
        queryInterface.removeColumn(
            'Message',
            'deleted'
        );
    }
};
