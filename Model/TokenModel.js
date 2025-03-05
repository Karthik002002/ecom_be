import { sequelize } from "../db/Config.js";
import { DataTypes } from "sequelize";
import User from "../Model/UserModel.js";

const Token = sequelize.define(
  "token",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        // model: "Users",
        key: "id",
      },
    },
    token: { type: DataTypes.STRING, allowNull: false },
  },
  {
    timestamps: true,
  }
);

User.hasMany(Token, { foreignKey: "user" });
Token.belongsTo(User, { foreignKey: "user" });

export { Token };
