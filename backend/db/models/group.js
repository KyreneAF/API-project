'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     Group.hasMany(models.groupId,{
      foreignKey:'groupId'
     })
    }
  }
  Group.init({
    organizerId: {
      type:DataTypes.INTEGER,
      references:{
        model:'Users',
        key:'id'
      }
    },
    name: {
      type:DataTypes.STRING,
      allowNull:false
    },
    about:{
      type:DataTypes.TEXT,
      allowNull:false
    },
    type: {
      type:DataTypes.ENUM('Online','In Person'),
      allowNull:false
    },
    private: {
      type:DataTypes.BOOLEAN,
      allowNull:false
    },
    city: {
      type:DataTypes.STRING
    },
    state: {
      type:DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
