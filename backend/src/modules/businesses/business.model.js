import { DataTypes, sequelize } from "../../common/dal/index.js";
import { Market } from "../markets/market.model.js";

export const Business = sequelize.define(
  "business",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    external_ref: { type: DataTypes.STRING, unique: true, allowNull: false },
    legal_name: { type: DataTypes.STRING, allowNull: true },
    registration_number: { type: DataTypes.STRING, allowNull: true },
    country: { type: DataTypes.STRING(2), allowNull: true },
    market_id: { type: DataTypes.UUID, allowNull: true },
    status: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: "active",
    },
  },
  { tableName: "businesses" }
);

Market.hasMany(Business, { foreignKey: "market_id" });
Business.belongsTo(Market, { foreignKey: "market_id" });
