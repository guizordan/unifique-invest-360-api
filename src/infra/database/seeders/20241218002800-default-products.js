"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Products", [
      {
        id: "CCM",
        name: "Milho",
        quantityPerContract: 450,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "SJC",
        name: "Soja",
        quantityPerContract: 450,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "WDO",
        name: "Dólar",
        quantityPerContract: 10000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Products", null, {});
  },
};
