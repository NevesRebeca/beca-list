import "dotenv/config";
import Sequelize from "sequelize";

const dbhost = process.env.DB_HOST;
const dbport = process.env.DB_PORT;
const database = process.env.DB_NAME;
const userName = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

const sequelize = new Sequelize(database, userName, password, {
  host: dbhost,
  port: dbport,
  dialect: "mysql",
});

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

export default sequelize;
