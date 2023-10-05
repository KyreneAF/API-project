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
     Group.hasMany(models.Event,{
      foreignKey:'groupId',
      onDelete:'CASCADE'
     });
     Group.hasMany(models.Membership,{
       foreignKey:'groupId',
       onDelete:'CASCADE'
      });
      Group.hasMany(models.Venue,{
        foreignKey:'groupId',
        onDelete:'CASCADE'
      });
      Group.hasMany(models.GroupImage,{
        foreignKey:'groupId',
        onDelete:'CASCADE'
      })
        Group.belongsTo(models.User,{
         foreignKey:'organizerId',
         as:'Organizer',
         onDelete:'CASCADE'
        });
     
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
      type:DataTypes.ENUM('Online','In person'),
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
