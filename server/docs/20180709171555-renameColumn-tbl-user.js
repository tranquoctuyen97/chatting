'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.renameColumn(
      'User',
        'isActive',
        'hello'
    );
  },

  down: (queryInterface, Sequelize) => {
      queryInterface.renameColumn(
          'User',
          'hello',
          'isActive'
      );
  }
};
