const { DataTypes } = require("sequelize");
const db = require("../db");

const User = db.define('user', {
    user_Id: {
       type: DataTypes.INTEGER,
       allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    budget: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    user_Activities: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = User;