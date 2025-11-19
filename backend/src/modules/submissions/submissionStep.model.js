import { DataTypes, sequelize } from "../../common/dal/index.js";
import { KycSubmission } from "./submission.model.js";

export const KycSubmissionStep = sequelize.define(
  "kyc_submission_step",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    submission_id: { type: DataTypes.UUID, allowNull: false },
    step_key: { type: DataTypes.STRING(50), allowNull: false },
    step_number: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING(20), defaultValue: "pending" },
    form_data: { type: DataTypes.JSONB, defaultValue: {} },
    completed_at: { type: DataTypes.DATE },
  },
  { tableName: "kyc_submission_steps" }
);

KycSubmission.hasMany(KycSubmissionStep, { foreignKey: "submission_id" });
KycSubmissionStep.belongsTo(KycSubmission, { foreignKey: "submission_id" });
