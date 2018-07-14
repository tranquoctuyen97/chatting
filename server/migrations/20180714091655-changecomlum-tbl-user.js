'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.changeColumn(
          'Group',
          'type',
          {
            type: Sequelize.ENUM('private', 'group')
          }
      );
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.changeColumn(
          'Group',
          'type',
          {
              type: Sequelize.STRING
          }
      );
  }
};
