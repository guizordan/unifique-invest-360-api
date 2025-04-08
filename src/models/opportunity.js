import { Model } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default function defineOpportunityModel(sequelize, DataTypes) {
  class Opportunity extends Model {
    static associate(models) {}
  }

  Opportunity.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
      },
      recommendation: DataTypes.ENUM("BUY", "SELL", "NEUTRAL"),
      commentary: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Opportunity",
    }
  );

  return Opportunity;
}
