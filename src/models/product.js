import { Model } from "sequelize";

export default function defineProductModel(sequelize, DataTypes) {
  class Product extends Model {
    static associate(models) {}
  }

  Product.init(
    {
      id: {
        type: DataTypes.ENUM("CCM", "SJC", "WDO"),
        primaryKey: true,
      },
      recommendation: DataTypes.ENUM("BUY", "SELL", "NEUTRAL"),
      commentary: DataTypes.STRING,
      priceLastUpdatedAt: DataTypes.DATE,
      name: DataTypes.STRING,
      price: DataTypes.DOUBLE,
      quantityPerContract: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );

  return Product;
}
