import { Model } from "sequelize";
import { v4 as uuidv4 } from "uuid";

import { OrderStatusEnum } from "../helpers/index.js";

export default function defineOrderStatusModel(sequelize, DataTypes) {
  class OrderStatus extends Model {
    static associate(models) {
      this.belongsTo(models.Order, {
        foreignKey: "orderId",
        onDelete: "CASCADE",
      });
      this.belongsTo(models.User, {
        foreignKey: "createdBy",
      });
    }
  }

  OrderStatus.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
      },
      orderId: DataTypes.UUID,
      status: {
        type: DataTypes.ENUM(
          OrderStatusEnum.CREATED,
          OrderStatusEnum.APPROVED,
          OrderStatusEnum.COMPLETED,
          OrderStatusEnum.CANCELLED
        ),
        allowNull: false,
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "OrderStatus",
      updatedAt: false,
    }
  );

  return OrderStatus;
}
