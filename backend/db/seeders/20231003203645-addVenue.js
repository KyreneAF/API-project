'use strict';
const {Event,Group,Venue} =require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
const venues = [
  {
    grpName:'Trivia Night',
    address: '123 Sunny rd.',
    city:'Dallas',
    state:'TX',
    lat: 32.7767,
    lng:96.7970
  },
  {
    grpName:'Cheese Tasting',
    address: '222 Dessert dr.',
    city:'Phoenix',
    state:'AZ',
    lat: 33.4484,
    lng:112.0740
  },
  {
    grpName:'Kitty social',
    address: '555 Tomorrow ln.',
    city:'Phoenix',
    state:'TX',
    lat: 32.7767,
    lng:96.7970
  },
  {
    grpName:'Hiking Team',
    address: '234 Government Camp',
    city:'Portland',
    state:'OR',
    lat: 45.3735,
    lng:121.6958
  },
  {
    grpName:'Book Club',
    address: '34 NE 11th Street',
    city:'Miami',
    state:'FL',
    lat: 30.7767,
    lng:30.7970
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    for(let soloVenue of venues){
      const {grpName,...venueDetails} = soloVenue

      const foundGroup = await Group.findOne({
        where:{
          name:grpName
        }
      })
      await Venue.create({
        groupId:foundGroup.id,
        ...venueDetails
      }),
      {validate:true}
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Venues',{address: venues.map(venue => venue.address)},{})
  }
};
