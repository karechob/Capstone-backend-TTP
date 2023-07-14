const crypto = require('crypto')
const { Model, DataTypes} = require("sequelize")
const db = require("../db")

class User extends Model {
    static async generateSalt() {
        return crypto.randomBytes(16).toString('base64')
    }
    static async encryptPassword(pw, salt){
        return crypto
        .createHash("RSA-SHA256")
        .update(pw)
        .update(salt)
        .digest(hex);
    }

    //instance method to check pw 
    async correctPassword(pwAttempt){
        return User.encryptPassword(pwAttempt, this.salt) === this.password;
    }
}
