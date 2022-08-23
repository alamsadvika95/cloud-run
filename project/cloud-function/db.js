const sequelize = require("sequelize");

const db = new sequelize("testing", "root", "Sadvikaalam98_", {
  host : "35.224.90.128", 
  dialect: "mysql"
});

db.sync({});

module.exports = db;
