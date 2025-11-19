import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function swagger(app) {
  const openapiPath = path.join(__dirname, "..", "docs", "openapi.json");
  let spec = {};
  try {
    const raw = fs.readFileSync(openapiPath, "utf-8");
    spec = JSON.parse(raw);
  } catch (e) {
    spec = {
      openapi: "3.0.3",
      info: { title: "KYC Service", version: "0.1.0" },
      paths: {},
    };
  }
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));
}
