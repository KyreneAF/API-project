'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Event.init({
    venueId: {
      type:DataTypes.INTEGER,
      references:{
        model:'Venues',
        key:'id'
      }
    },
    groupId: {
      type:DataTypes.INTEGER,
      references:{
        model:'Groups',
        key:'id'
      }
    },
    name: {
      type:DataTypes.STRING,
      allowNull:false
    },
    description: {
      type:DataTypes.TEXT
    },
    type:{
      type:DataTypes.ENUM,
      allowNull:false
    },
    capacity: {
      type:DataTypes.INTEGER
    },
    price: {
      type:DataTypes.INTEGER
    },
    startDate: {
      type:DataTypes.DATE,
      allowNull:false
    },
    endDate: {
     type: DataTypes.DATE,
     allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
