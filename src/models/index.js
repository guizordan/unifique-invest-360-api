import { Sequelize, DataTypes } from "sequelize";
import config from "../config/config.js";

import UserModel from "./user.js";
import OrderModel from "./order.js";
import OrderStatusModel from "./orderstatus.js";
import PasswordRecoveryModel from "./passwordrecovery.js";
import ProductModel from "./product.js";
import NewsModel from "./news.js";

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: process.env.NODE_ENV === "dev" ? console.log : false,
  }
);

const User = UserModel(sequelize, DataTypes);
const Order = OrderModel(sequelize, DataTypes);
const OrderStatus = OrderStatusModel(sequelize, DataTypes);
const PasswordRecovery = PasswordRecoveryModel(sequelize, DataTypes);
const Product = ProductModel(sequelize, DataTypes);
const News = NewsModel(sequelize, DataTypes);

const models = [User, Order, OrderStatus, PasswordRecovery, Product, News];

for (const model of models) {
  if (model.associate) {
    model.associate({ User, Order, OrderStatus });
  }
}

export {
  sequelize,
  Sequelize,
  User,
  Order,
  OrderStatus,
  PasswordRecovery,
  Product,
  News,
};
