'use strict';
const bcrypt = require("bcryptjs")
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Profile,{
        foreignKey: "UserId"
      })

      User.hasMany(models.Transaction,{
        foreignKey: "UserId"
      })
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      validate: {
        notEmpty : {
          msg: `username is required`
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty : {
          msg: `password is required`
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty : {
          msg: `email is required`
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      validate: {
        notEmpty : {
          msg: `role is required`
        }
      }
    }
  }, {
    hooks : {
      beforeCreate(instance, option) {
        let salt = bcrypt.genSaltSync(10)
        let hash = bcrypt.hashSync(instance.password, salt)

        instance.password = hash
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};