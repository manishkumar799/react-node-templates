import { DataTypes, sequelize } from "../../common/dal/index.js";
import { Market } from "./market.model.js";

export const KycDocumentType = sequelize.define(
  "kyc_document_type",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    market_id: { type: DataTypes.UUID, allowNull: false },
    code: { type: DataTypes.STRING(50), allowNull: false },
    name: { type: DataTypes.STRING(150), allowNull: false },
    description: { type: DataTypes.TEXT },
    is_required: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    min_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    max_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    allowed_mime_types: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    validations: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    version: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  },
  { tableName: "kyc_document_types" }
);

Market.hasMany(KycDocumentType, { foreignKey: "market_id" });
KycDocumentType.belongsTo(Market, { foreignKey: "market_id" });
