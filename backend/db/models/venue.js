'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Venue.hasMany(models.Event,{
        foreignKey:'venueId'
      });
      Venue.belongsTo(models.Group,{
        foreignKey:'groupId',
        onDelete:'CASCADE'

      });
    }
  }
  Venue.init({
    groupId: {
     type: DataTypes.INTEGER,
     references:{
      model:'Groups',
      key:'id'
     }
    },
    address: {
      type:DataTypes.STRING
    },
    city: {
      type:DataTypes.STRING
    },
    state: {
     type: DataTypes.STRING
    },
    lat: {
     type: DataTypes.DECIMAL
    },
    lng: {
      type:DataTypes.DECIMAL
    }
  }, {
    sequelize,
    modelName: 'Venue',
    defaultScope:{
      attributes:{
        exclude:['createdAt','updatedAt']
      }
    }
  });
  return Venue;
};
