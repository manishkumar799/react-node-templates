import { Sequelize, DataTypes, Op } from "sequelize";
import { getSequelize } from "../../loaders/db.js";

const sequelize = getSequelize();
// sequelize
//   .sync({ alter: true })
//   .then(() => {
//     console.log("Database synchronized successfully.");
//   })
//   .catch((error) => {
//     console.error("Error synchronizing database:", error);
//   });

export { sequelize, DataTypes, Op };
