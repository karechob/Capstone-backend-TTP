const { DataTypes } = require("sequelize");
const db = require("../db");

const User = db.define('user', {
    id: {
       type: DataTypes.INTEGER,
       allowNull: false,
       autoIncrement: true,
       primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = User;