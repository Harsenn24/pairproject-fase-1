'use strict';

const {Op} = require("sequelize")
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clothe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Clothe.hasMany(models.Transaction, {
        foreignKey : "ClotheId"
      })
    }

    statusSell(value) {
      if(this.stock === 0) {
        return (value = "OutOfStock")
      } else {
        return (value = "ReadyStock")
      }
    }

    changeFormat(value){
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)
    }

    static searchByName(name) {
      if(!name) {
        name = ""
      }
      return {[Op.iLike]: `%${name}%`}
    }
  }
  Clothe.init({
    imageUrl: {
      type: DataTypes.STRING,
      validate: {
        notEmpty : {
          msg: `Image URL is required`
        },
        isUrl: { msg : 'Must be url' }
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty : {
          msg: `Name is required`
        },
        maxium(value){
          if(value.length < 5){
            throw new Error(`minimun 5 characters`)
          }
          if(value.length > 20){
            throw new Error(`maximum 20 characters`)
          }
          if(value.split(' ').length > 5){
            throw new Error(`maximum word is 5`)
          }
        }
      }
    },
    type: {
      type: DataTypes.STRING,
      validate: {
        notEmpty : {
          msg: `Type is required`
        }
      }
    },
    price : {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty : {
          msg: `Price is required`
        },
        min: { args: 1000, msg: 'Minimum price Rp. 1000' }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty : {
          msg: `Stock is required`
        },
        min: { args: [0], msg: 'invalid stock' }
      }
    },
    status: {
      type: DataTypes.STRING,
      validate: {
        notEmpty : {
          msg: `status is required`
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Clothe',
  });
  return Clothe;
};