/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("OrderStatuses", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.CHAR(36),
      },
      orderId: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        references: { model: "Orders", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      status: {
        type: Sequelize.ENUM(
          "created",
          "approved",
          "executed",
          "completed",
          "cancelled"
        ),
        allowNull: false,
        defaultValue: "created",
      },
      createdBy: {
        type: Sequelize.CHAR(36),
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("OrderStatusHistory");
  },
};
