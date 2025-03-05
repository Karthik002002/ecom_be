import { DataTypes } from "sequelize";
import { sequelize } from "../db/Config.js";

const Product = sequelize.define(
  "product",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    product_name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    category: { type: DataTypes.STRING, allowNull: true },
    image_url: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.BOOLEAN, defaultValue: true },
    discount: { type: DataTypes.FLOAT, allowNull: true }, // Can be percentage or fixed
    discount_type: {
      type: DataTypes.ENUM("percentage", "fixed"),
      allowNull: true,
    }, // NULL when no discount
  },
  {
    timestamps: true,
  }
);

export { Product };
