import { DataTypes, sequelize } from "../../common/dal/index.js";
import { KycFormStep } from "./kycFormStep.model.js";

export const KycFormField = sequelize.define(
  "kyc_form_field",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    step_id: { type: DataTypes.UUID, allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    field_key: { type: DataTypes.STRING(100), allowNull: false },
    field_label: { type: DataTypes.STRING(200), allowNull: false },
    field_type: { type: DataTypes.STRING(50), allowNull: false },
    field_options: { type: DataTypes.JSONB, defaultValue: {} },
    is_required: { type: DataTypes.BOOLEAN, defaultValue: true },
    display_order: { type: DataTypes.INTEGER, allowNull: false },
    validation_rules: { type: DataTypes.JSONB, defaultValue: {} },
  },
  { tableName: "kyc_form_fields" }
);

KycFormStep.hasMany(KycFormField, { foreignKey: "step_id" });
KycFormField.belongsTo(KycFormStep, { foreignKey: "step_id" });
