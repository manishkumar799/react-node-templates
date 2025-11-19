import { Sequelize } from "sequelize";
import config from "../config/index.js";
import logger from "../common/utils/logger.js";

let sequelize;

function init() {
  if (sequelize) return sequelize;
  sequelize = new Sequelize(config.db.url, {
    dialect: "postgres",
    logging: (msg) => logger.debug(msg),
    pool: { min: config.db.poolMin, max: config.db.poolMax },
    define: { underscored: true },
  });
  return sequelize;
}

async function health() {
  try {
    const s = init();
    await s.authenticate();
    return true;
  } catch (e) {
    return false;
  }
}

export function getSequelize() {
  return init();
}

export default { init, getSequelize, health };
