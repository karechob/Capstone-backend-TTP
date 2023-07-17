const { DataTypes } = require("sequelize");
const db = require("../db");

const Hotel = db.define("hotel", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cost: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Hotel;
