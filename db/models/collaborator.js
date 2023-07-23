const { DataTypes } = require("sequelize");
const db = require("../db");

const Collaborator = db.define("collaborator", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Collaborator;
