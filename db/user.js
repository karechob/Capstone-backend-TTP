const crypto = require('crypto');
const { password, user } = require('pg/lib/defaults');
const { Model, DataTypes } = require("sequelize")
const db = require("../db")

class User extends Model {
    static async generateSalt() {
        return crypto.randomBytes(16).toString('base64')
    }
    static async encryptPassword(pw, salt) {
        return crypto
            .createHash("RSA-SHA256")
            .update(pw)
            .update(salt)
            .digest(hex);
    }

    //instance method to check pw 
    async correctPassword(pwAttempt) {
        return User.encryptPassword(pwAttempt, this.salt) === this.password;
    }
}

User.init(
    {
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING
        },
        salt: {
            type: DataTypes.STRING
        },
        googleId: {
            type: DataTypes.STRING
        },
    },
    {
        sequelize:db,
        modelName:"User",
        hooks: {
            beforeSave: async (user) => {
                if(user.changed('password')) {
                    user.salt = await User.generateSalt();
                    user.password = await User.encryptPassword(user.password, user.salt);
                }
            }
        }
    }
)