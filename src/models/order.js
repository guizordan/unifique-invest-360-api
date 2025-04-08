import { Model } from "sequelize";
import { v4 as uuidv4 } from "uuid";

import { OrderStatus, User } from "./index.js";
import { ProductEnum } from "../helpers/index.js";
import { sendOrderCreatedEmail } from "../helpers/mailer.js";

export default function defineOrderModel(sequelize, DataTypes) {
  class Order extends Model {
    static associate(models) {
      this.hasMany(models.OrderStatus, { foreignKey: "orderId" });
      this.belongsTo(models.User, { foreignKey: "userId" });
    }

    async getStatuses() {
      const orderStatuses = await OrderStatus.findAll({
        where: { orderId: this.id },
        order: [["createdAt", "DESC"]],
      });

      if (!orderStatuses.length) {
        this.dataValues.statuses = [];
        return;
      }

      const orderStatusesWithUser = await Promise.all(
        orderStatuses.map(async (orderStatus) => {
          const user = await User.findByPk(orderStatus.createdBy);
          delete orderStatus.dataValues.orderId;
          return {
            ...orderStatus.dataValues,
            createdBy: { fullName: user.fullName, email: user.email },
          };
        })
      );

      if (orderStatusesWithUser.length) {
        this.dataValues.currentStatus = orderStatusesWithUser[0].status;
        this.dataValues.statusLastModifiedBy =
          orderStatusesWithUser[0].createdBy;
      }

      this.dataValues.statuses = orderStatusesWithUser;
    }

    async getUser() {
      const user = await User.findByPk(this.userId, {
        attributes: { exclude: ["password"] },
      });
      this.dataValues.user = user;
      return user;
    }
  }

  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
      },
      product: {
        type: DataTypes.ENUM(ProductEnum.CCM, ProductEnum.SJC, ProductEnum.WDO),
        allowNull: false,
        validate: {
          notNull: {
            msg: "Por favor, selecione um produto.",
          },
          isIn: {
            args: [[ProductEnum.CCM, ProductEnum.SJC, ProductEnum.WDO]],
            msg: "Selecione um produto válido.",
          },
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Por favor, insira a quantidade.",
          },
          isGreaterThanOne(value) {
            if (value <= 0) {
              throw new Error("Quantidade deve ser maior que 0.");
            }
          },
        },
      },
      executionPrice: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        validate: {
          isGreaterThanOne(value) {
            if (value <= 0) {
              throw new Error("Preço de execução deve ser maior que 0.");
            }
          },
        },
      },
      closurePrice: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        validate: {
          isGreaterThanOne(value) {
            if (value <= 0) {
              throw new Error("Preço de encerramento deve ser maior que 0.");
            }
          },
        },
      },
      operationType: {
        type: DataTypes.ENUM("BUY", "SELL"),
        allowNull: true,
        validate: {
          isIn: {
            args: [["BUY", "SELL"]],
            msg: "Selecione um tipo de operação válido.",
          },
        },
      },
      ticker: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );

  Order.afterCreate(async (order) => {
    try {
      const user = await order.getUser();

      await sendOrderCreatedEmail({
        order,
        user,
      });
    } catch (error) {
      console.error("Erro ao enviar e-mail de criação de ordem.");
      console.error(error.body?.message);
    }
  });

  return Order;
}
