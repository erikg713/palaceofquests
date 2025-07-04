// backend/models/User.js

const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

// Define your user roles or statuses here for consistency
const USER_ROLES = ['user', 'admin', 'moderator'];

module.exports = (sequelize) => {
  class User extends Model {
    // Instance method to check password validity
    async validPassword(password) {
      return bcrypt.compare(password, this.password_hash);
    }

    // Hide sensitive data when serializing
    toJSON() {
      const values = { ...this.get() };
      delete values.password_hash;
      return values;
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 32],
        },
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(...USER_ROLES),
        defaultValue: 'user',
        allowNull: false,
      },
      avatar_url: {
        type: DataTypes.STRING,
        validate: {
          isUrl: true,
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true,
      timestamps: true,
      hooks: {
        beforeCreate: async (user) => {
          if (user.changed('password_hash')) {
            user.password_hash = await bcrypt.hash(user.password_hash, 12);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('password_hash')) {
            user.password_hash = await bcrypt.hash(user.password_hash, 12);
          }
        },
      },
    }
  );

  return User;
};
