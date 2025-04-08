/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.CHAR(36),
      },
      product: {
        allowNull: false,
        type: Sequelize.ENUM("CCM", "SJC", "WDO"),
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      executionPrice: {
        allowNull: true,
        type: Sequelize.DOUBLE,
      },
      closurePrice: {
        allowNull: true,
        type: Sequelize.DOUBLE,
      },
      operationType: {
        allowNull: true,
        type: Sequelize.ENUM("BUY", "SELL"),
      },
      ticker: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Orders");
  },
};
