'use strict';

const fs = require("fs")

module.exports = {
   up (queryInterface, Sequelize) {
    let data = JSON.parse(fs.readFileSync("./clothes.json","utf-8"))
    data.forEach(x=>{
      x.createdAt = new Date()
      x.updatedAt = new Date()
    })
    return queryInterface.bulkInsert('Clothes', data, {})
  },

   down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Clothes', null, {})
  }
};
