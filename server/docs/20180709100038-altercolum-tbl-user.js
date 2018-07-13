'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.changeColumn(
        'User',
        'isActive',
        Sequelize.STRING
    );
  },

  down: (queryInterface, Sequelize) => {
      queryInterface.removeColumn(
          'User',
          'isActive'
      );
  }
};
