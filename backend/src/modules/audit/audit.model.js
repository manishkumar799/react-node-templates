import { DataTypes, sequelize } from "../../common/dal/index.js";

export const KycAuditLog = sequelize.define(
  "kyc_audit_log",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    submission_id: { type: DataTypes.UUID, allowNull: true },
    business_id: { type: DataTypes.UUID, allowNull: true },
    actor_type: { type: DataTypes.STRING(20), allowNull: false }, // system|admin|business
    actor_id: { type: DataTypes.STRING(100), allowNull: true },
    action: { type: DataTypes.STRING(100), allowNull: false },
    from_status: { type: DataTypes.STRING(40), allowNull: true },
    to_status: { type: DataTypes.STRING(40), allowNull: true },
    payload: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { tableName: "kyc_audit_logs", updatedAt: false, createdAt: "created_at" }
);
