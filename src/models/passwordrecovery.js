import { Model } from "sequelize";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export default function definePasswordRecoveryModel(sequelize, DataTypes) {
  class PasswordRecovery extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "SET NULL",
      });
    }
  }

  PasswordRecovery.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING,
      },
      claimedAt: DataTypes.DATE,
      expiredAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "PasswordRecovery",
      updatedAt: false,
    }
  );

  PasswordRecovery.beforeCreate(async (passwordRecovery) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const token = await bcrypt.hash(Date.now().toString(), salt);
      passwordRecovery.token = token;
    } catch (err) {
      throw new Error("Erro ao gerar token para recuperação de conta.");
    }
  });

  return PasswordRecovery;
}
