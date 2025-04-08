/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("PasswordRecoveries", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.CHAR(36),
      },
      userId: {
        allowNull: false,
        type: Sequelize.CHAR(36),
      },
      token: {
        type: Sequelize.STRING,
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      claimedAt: {
        type: Sequelize.DATE,
      },
      expiredAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("PasswordRecoveries");
  },
};
