import { DataTypes } from "sequelize";
/** @type {import('sequelize-cli').Migration} */ export default {
    async up (queryInterface) {
        await queryInterface.createTable("Customers", {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.CHAR(36)
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            phone: {
                type: DataTypes.STRING,
                unique: true
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            cpf: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: true
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE
            }
        });
    },
    async down (queryInterface) {
        await queryInterface.dropTable("Customers");
    }
};

//# sourceMappingURL=20240226030353-create-customers.js.map