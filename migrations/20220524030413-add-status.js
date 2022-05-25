'use strict';

module.exports = {
   up (queryInterface, Sequelize) {
    return queryInterface.addColumn("Clothes", "status", {type : Sequelize.STRING})
  },

   down (queryInterface, Sequelize) {
    return queryInterface.removeColumn("Clothes", "status", {})
  }
};
