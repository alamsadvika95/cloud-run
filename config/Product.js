const Sequelize = require("sequelize");
const db = require("./db");

const Product = db.define(
  "product",
  {
    name: { type: Sequelize.STRING },
    description: { type: Sequelize.STRING },
    image: { type: Sequelize.STRING }
  },
  {
    freezeTableName: true 
  }
);

module.exports = Product; 