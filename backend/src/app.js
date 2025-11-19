import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import routes from "./loaders/routes.js";
import swagger from "./loaders/swagger.js";
import db from "./loaders/db.js";
import requestId from "./common/middleware/requestId.js";
import errorHandler from "./common/middleware/errorHandler.js";
import config from "./config/index.js";
import logger from "./common/utils/logger.js";

const app = express();

// Core middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: `${config.upload.maxSizeMb}mb` }));
app.use(requestId());
app.use(pinoHttp({ logger }));

// Health endpoints
app.get("/health", async (req, res) => {
  const dbOk = await db.health();
  res.json({ ok: true, db: dbOk });
});
app.get("/ready", async (req, res) => {
  const dbOk = await db.health();
  res.status(dbOk ? 200 : 503).json({ ready: dbOk });
});

// Swagger
swagger(app);

// Routes
routes(app);

// Error handler
app.use(errorHandler());

export default app;
