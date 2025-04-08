import { Model } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default function defineNewsModel(sequelize, DataTypes) {
  class News extends Model {
    static associate(models) {}
  }

  News.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Por favor, coloque um título.",
          },
        },
      },
      body: DataTypes.STRING,
      embedded: DataTypes.BOOLEAN,
      embeddedUrl: DataTypes.STRING,
      imagePath: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "News",
    }
  );

  return News;
}
