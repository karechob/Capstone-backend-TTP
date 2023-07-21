const crypto = require("node:crypto");
const { Model, DataTypes } = require("sequelize");
const db = require("../db");

class User extends Model {
  static async generateSalt() {
    return crypto.randomBytes(16).toString("base64");
  }

  static async encryptPassword(pw, salt) {
    return crypto
      .createHash("RSA-SHA256")
      .update(pw)
      .update(salt)
      .digest("hex");
  }

  async correctPassword(pwAttempt) {
    return (await User.encryptPassword(pwAttempt, this.salt)) === this.password;
  }
}

User.init(
  {
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
      allowNull: true,
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
    tableName: "users",
    modelName: "User",
    hooks: {
      beforeSave: async (user) => {
        if (user.changed("password")) {
          user.salt = await User.generateSalt();
          user.password = await User.encryptPassword(user.password, user.salt);
        }
      },
      beforeBulkCreate: async (users) => {
        for (const user of users) {
          if (user.changed("password")) {
            user.salt = await User.generateSalt();
            user.password = await User.encryptPassword(
              user.password,
              user.salt
            );
          }
        }
      },
    },
  }
);

module.exports = User;
