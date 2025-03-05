import { sequelize } from "../db/Config.js";
import { DataTypes } from "sequelize";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true,/
      validate: {
        isEmail: true,
      },
    },
    phone_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    user_role: {
      type: DataTypes.INTEGER,
      defaultValue: 2, // 1 -> admin, 2 -> user
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["username"], // Add unique constraint properly
      },
    ],
  }
);

export default User;
