import { DataTypes, sequelize } from "../../common/dal/index.js";

export const Outbox = sequelize.define(
  "kyc_outbox",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    aggregate_type: { type: DataTypes.STRING(50), allowNull: false },
    aggregate_id: { type: DataTypes.UUID, allowNull: false },
    event_type: { type: DataTypes.STRING(100), allowNull: false },
    payload: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  { tableName: "kyc_outbox" }
);
