'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
        'User',
        'hello'
    );
  },

  down: (queryInterface, Sequelize) => {

  }
};
