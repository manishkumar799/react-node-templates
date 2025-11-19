import { Outbox } from "./outbox.model.js";
import logger from "../../common/utils/logger.js";

let running = false;

export function startPublisherLoop() {
  if (running) return;
  running = true;
  setInterval(async () => {
    try {
      const items = await Outbox.findAll({
        where: { status: "pending" },
        limit: 50,
        order: [["created_at", "ASC"]],
      });
      for (const item of items) {
        // TODO: publish to broker; dev-only: log
        logger.info(
          { event: item.event_type, aggregate_id: item.aggregate_id },
          "Publishing outbox event (dev)"
        );
        await item.update({ status: "published" });
      }
    } catch (e) {
      logger.error({ err: e }, "Outbox publisher error");
    }
  }, 2000);
}
