import pino from "pino";
import config from "../../config/index.js";

const logger = pino({
  level: config.log.level || "info",
  base: undefined,
  redact: ["req.headers.authorization", "password", "secret"],
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err,
  },
  transport:
    config.app.env === "development" ? { target: "pino-pretty" } : undefined,
});

export default logger;
