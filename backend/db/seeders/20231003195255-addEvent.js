'use strict';
const {Event,Group,venue} = require('../models')

const events =[
  {
    venue:'*change me*',
    groupName: 'Trivia Night',
    name: 'Halloween Horror Movie Trivia',
    type: 'In person',
    capacity: 20,
    price: 5,
    startDate: new Date('2023-10-31 20:00:00'),
    endDate: new Date('2023-10-31 22:00:00')
  },
  {
    venue:'*change me*',
    groupName: 'Cheese Tasting',
    name: 'First Cheese Meeting',
    type: 'In person',
    capacity: 20,
    price: 25,
    startDate: new Date('2023-10-14 20:00:00'),
    endDate: new Date('2023-10-14 22:00:00')
  },
  {
    venue:'*change me*',
    groupName: 'Kitty social',
    name: 'Meet and Greet',
    type: 'Online',
    capacity: 50,
    price: 0,
    startDate: new Date('2023-12-31 20:00:00'),
    endDate: new Date('2023-12-31 22:00:00')
  },
  {
    venue:'*change me*',
    groupName: 'Hiking Team',
    name: 'Spring Hike',
    type: 'In person',
    capacity: 10,
    price: 10,
    startDate: new Date('2024-4-1 20:00:00'),
    endDate: new Date('2024-4-1 22:00:00')
  },
  {
    venue:'*change me*',
    groupName: 'Book Club',
    name: 'Twilight Reading',
    type: 'Online',
    capacity: 15,
    price: 10,
    startDate: new Date('2024-4-1 20:00:00'),
    endDate: new Date('2024-4-1 22:00:00')
  },

]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    for(let meets of events){
      const {venue,groupName,...eventDetails} = meets
      const foundVenue = await Venue.findOne({
        where:{
          address: venue
        }
      });
      const foundGroup = await Group.findOne({
        where:{
          name:groupName
        },
      })
    }
    await Event.create({
      venueId:foundVenue.id,
      groupId:foundGroup.id,
      ...eventDetails,
    })


  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Events',{name: events.name},{})
  }
};
