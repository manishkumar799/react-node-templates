import { DataTypes } from "../../common/dal/index.js";
import { sequelize } from "../../common/dal/index.js";

export const Market = sequelize.define(
  "market",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: { type: DataTypes.STRING(10), allowNull: false, unique: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    workflow_config: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
  },
  { tableName: "markets" }
);
