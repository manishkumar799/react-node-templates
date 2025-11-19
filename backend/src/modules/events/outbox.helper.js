import { Outbox } from "./outbox.model.js";

export async function enqueueEvent(
  { aggregate_type, aggregate_id, event_type, payload },
  t
) {
  return Outbox.create(
    {
      aggregate_type,
      aggregate_id,
      event_type,
      payload,
      status: "pending",
    },
    { transaction: t }
  );
}
