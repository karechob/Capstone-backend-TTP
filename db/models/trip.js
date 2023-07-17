const { DataTypes } = require("sequelize");
const db = require("../db");

const Trip = db.define("trip", {
  origin: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  budget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  isCurrent: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  weather: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = Trip;
