const sequelize = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const db = new sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
  host : process.env.DATABASE_HOST, 
  dialect: "mysql"
});

db.sync({});

module.exports = db;
