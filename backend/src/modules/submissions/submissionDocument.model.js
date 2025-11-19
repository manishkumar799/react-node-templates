import { DataTypes, sequelize } from "../../common/dal/index.js";
import { KycSubmission } from "./submission.model.js";

export const KycSubmissionDocument = sequelize.define(
  "kyc_submission_document",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    submission_id: { type: DataTypes.UUID, allowNull: false },
    step_key: { type: DataTypes.STRING(50), allowNull: true },
    field_key: { type: DataTypes.STRING(100), allowNull: true },
    // document_type_id: { type: DataTypes.UUID, allowNull: true }, // backward compatibility
    document_type: { type: DataTypes.STRING, allowNull: true }, // backward compatibility
    cloudinary_public_id: { type: DataTypes.STRING, allowNull: true },
    cloudinary_secure_url: { type: DataTypes.STRING, allowNull: true },
    filename: { type: DataTypes.STRING, allowNull: true },
    mime_type: { type: DataTypes.STRING, allowNull: true },
    size_bytes: { type: DataTypes.BIGINT, allowNull: true },
    status: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: "uploaded",
    },
    metadata: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
  },
  { tableName: "kyc_submission_documents" }
);

KycSubmission.hasMany(KycSubmissionDocument, { foreignKey: "submission_id" });
KycSubmissionDocument.belongsTo(KycSubmission, { foreignKey: "submission_id" });
