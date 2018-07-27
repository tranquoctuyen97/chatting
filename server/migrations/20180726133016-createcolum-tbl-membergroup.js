'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.addColumn(
            'MemberGroup',
            'isExist',
            Sequelize.BOOLEAN
        );
    },

    down: (queryInterface, Sequelize) => {
        queryInterface.removeColumn(
            'MemberGroup',
            'isExist'
        );
    }
};
