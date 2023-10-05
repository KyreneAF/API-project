'use strict';

const { Event, Group, Venue } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
const events = [
  {
    ven: '123 Sunny rd.',
    groupName: 'Trivia Night',
    name: 'Halloween Horror Movie Trivia',
    description:'Join our spooky trivia night!',
    type: 'In person',
    capacity: 20,
    price: 5,
    startDate: new Date('2023-10-31T20:00:00'),
    endDate: new Date('2023-10-31T22:00:00'),
  },
  {
    ven: '222 Dessert dr.',
    groupName: 'Cheese Tasting',
    name: 'First Cheese Meeting',
    description:'Come join us for the first time with our very first meet and greet.',
    type: 'In person',
    capacity: 20,
    price: 25,
    startDate: new Date('2023-10-14T20:00:00'),
    endDate: new Date('2023-10-14T22:00:00'),
  },
  {
    ven: '555 Tomorrow ln.',
    groupName: 'Kitty social',
    name: 'Meet and Greet',
    description:'Visit our meet and greet where you can introduce your cat!',
    type: 'Online',
    capacity: 50,
    price: 0,
    startDate: new Date('2023-12-31T20:00:00'),
    endDate: new Date('2023-12-31T22:00:00'),
  },
  {
    ven: '234 Government Camp',
    groupName: 'Hiking Team',
    name: 'Spring Hike',
    description:'Come join us for our hike on our tallest mountain yet.',
    type: 'In person',
    capacity: 10,
    price: 10,
    startDate: new Date('2024-04-01T20:00:00'),
    endDate: new Date('2024-04-01T22:00:00'),
  },
  {
    ven: '34 NE 11th Street',
    groupName: 'Book Club',
    name: 'Twilight Reading',
    description:'Join our group of twilight reading for the spooky holiday',
    type: 'Online',
    capacity: 15,
    price: 10,
    startDate: new Date('2024-04-01T20:00:00'),
    endDate: new Date('2024-04-01T22:00:00'),
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    for(let eve of events){
      const{ven,groupName,...eventDetails} = eve

      const foundVenue = await Venue.findOne({
        where:{
          address:ven
        }
      })
      const foundGroup = await Group.findOne({
        where:{
          name:groupName
        }
      })

      await Event.create({
        venueId:null,
        groupId:foundGroup.id,
        ...eventDetails
      },{validate:true})
    }

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Events',{name: events.map(ev => ev.name)},{})
  }
};
