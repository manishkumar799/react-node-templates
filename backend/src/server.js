import { createServer } from "http";
import app from "./app.js";
import logger from "./common/utils/logger.js";
import config from "./config/index.js";

const server = createServer(app);
const port = config.app.port;

server.listen(port, () => {
  logger.info({ port }, "KYC service listening");
});

process.on("unhandledRejection", (err) => {
  logger.error({ err }, "Unhandled Rejection");
});
process.on("uncaughtException", (err) => {
  logger.error({ err }, "Uncaught Exception");
  process.exit(1);
});
