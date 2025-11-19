import { KycAuditLog } from "./audit.model.js";

export async function auditLog(
  {
    submission_id,
    business_id,
    actor_type,
    actor_id,
    action,
    from_status,
    to_status,
    payload,
  },
  t
) {
  return KycAuditLog.create(
    {
      submission_id,
      business_id,
      actor_type,
      actor_id,
      action,
      from_status,
      to_status,
      payload,
    },
    { transaction: t }
  );
}
