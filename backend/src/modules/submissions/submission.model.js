import { DataTypes, sequelize } from "../../common/dal/index.js";
import { Market } from "../markets/market.model.js";
import { Business } from "../businesses/business.model.js";

export const KycSubmission = sequelize.define(
  "kyc_submission",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    business_id: { type: DataTypes.UUID, allowNull: false },
    market_id: { type: DataTypes.UUID, allowNull: false },
    status: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: "draft",
    },
    completed_steps: { type: DataTypes.JSONB, defaultValue: [] },
    form_data: { type: DataTypes.JSONB, defaultValue: {} },
    metadata: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
  },
  { tableName: "kyc_submissions" }
);

// Business.hasMany(KycSubmission, { foreignKey: "business_id" });
// KycSubmission.belongsTo(Business, { foreignKey: "business_id" });
KycSubmission.belongsTo(Market, { foreignKey: "market_id" });
