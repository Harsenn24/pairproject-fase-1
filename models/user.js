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
        },
        maxium(value){
          if(value.length < 5){
            throw new Error(`minimun 5 characters`)
          }
          if(value.length > 20){
            throw new Error(`maximum 20 characters`)
          }
          if(value.split(' ').length > 2){
            throw new Error(`maximum word is 2`)
          }
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty : {
          msg: `password is required`
        },
        isValidate(value){
          if(value.length < 5){
            throw new Error(`minimun 5 characters`)
          }
          if(value.length > 20){
            throw new Error(`maximum 20 characters`)
          }
          if(value.split(' ').length > 1){
            throw new Error(`password can not have spaces`)
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty : {
          msg: `email is required`
        },
        isEmail: { msg: `the input entered must be email` }
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