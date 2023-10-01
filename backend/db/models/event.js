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
      Event.hasMany(models.EventImage,{
        foreignKey:'eventId'
      });

      Event.belongsTo(models.Group,{
        foreignKey:'groupId'
      });
      Event.belongsTo(models.Venue,{
        foreignKey:'venueId'
      });
      Event.hasMany(models.Attendance,{
        foreignKey:'eventId'
      })
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
      type:DataTypes.ENUM('Online','In Person'),
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
