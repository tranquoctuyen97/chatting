'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.changeColumn(
            'Group',
            'type',

        {
            type: Sequelize.ENUM,
                values: ['private', 'group']

        }

        );
    },

    down: (queryInterface, Sequelize) => {
        queryInterface.changeColumn(
            'Group',
            'type',
            {
                type: Sequelize.STRING

            }

        );
    }
};
