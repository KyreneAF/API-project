'use strict';

const { Event, Group, Venue } = require('../models');

const events = [
  {
    venue: '123 Sunny rd.',
    groupName: 'Trivia Night',
    name: 'Halloween Horror Movie Trivia',
    type: 'In person',
    capacity: 20,
    price: 5,
    startDate: new Date('2023-10-31T20:00:00'),
    endDate: new Date('2023-10-31T22:00:00'),
  },
  {
    venue: '222 Dessert dr.',
    groupName: 'Cheese Tasting',
    name: 'First Cheese Meeting',
    type: 'In person',
    capacity: 20,
    price: 25,
    startDate: new Date('2023-10-14T20:00:00'),
    endDate: new Date('2023-10-14T22:00:00'),
  },
  {
    venue: '555 Tomorrow ln.',
    groupName: 'Kitty social',
    name: 'Meet and Greet',
    type: 'Online',
    capacity: 50,
    price: 0,
    startDate: new Date('2023-12-31T20:00:00'),
    endDate: new Date('2023-12-31T22:00:00'),
  },
  {
    venue: '234 Government Camp',
    groupName: 'Hiking Team',
    name: 'Spring Hike',
    type: 'In person',
    capacity: 10,
    price: 10,
    startDate: new Date('2024-04-01T20:00:00'),
    endDate: new Date('2024-04-01T22:00:00'),
  },
  {
    venue: '34 NE 11th Street',
    groupName: 'Book Club',
    name: 'Twilight Reading',
    type: 'Online',
    capacity: 15,
    price: 10,
    startDate: new Date('2024-04-01T20:00:00'),
    endDate: new Date('2024-04-01T22:00:00'),
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      for (let eventData of events) {
        const { venue, groupName, ...eventDetails } = eventData;

        const foundVenue = await Venue.findOne({
          where: { address: venue },
        });

        if (!foundVenue) {
          console.error(`Venue not found for address: ${venue}`);
          continue;
        }

        const foundGroup = await Group.findOne({
          where: { name: groupName },
        });

        if (!foundGroup) {
          console.error(`Group not found for name: ${groupName}`);
          continue;
        }

        await Event.create({
          venueId: foundVenue.id,
          groupId: foundGroup.id,
          ...eventDetails,
        });
      }

      console.log('Seed data inserted successfully.');
    } catch (error) {
      console.error('Error seeding data:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Events', { name: events.map(event => event.name) }, {});
  }
};






// 'use strict';
// const {Event,Group,Venue} = require('../models')
// let options = {};
// if (process.env.NODE_ENV === 'production') {
//   options.schema = process.env.SCHEMA;  // define your schema in options object
// }

// const events =[
//   {
//     venue:'123 Sunny rd.',
//     groupName: 'Trivia Night',
//     name: 'Halloween Horror Movie Trivia',
//     type: 'In person',
//     capacity: 20,
//     price: 5,
//     startDate: new Date('2023-10-31 20:00:00'),
//     endDate: new Date('2023-10-31 22:00:00')
//   },
//   {
//     venue:'222 Dessert dr.',
//     groupName: 'Cheese Tasting',
//     name: 'First Cheese Meeting',
//     type: 'In person',
//     capacity: 20,
//     price: 25,
//     startDate: new Date('2023-10-14 20:00:00'),
//     endDate: new Date('2023-10-14 22:00:00')
//   },
//   {
//     venue:'555 Tomorrow ln.',
//     groupName: 'Kitty social',
//     name: 'Meet and Greet',
//     type: 'Online',
//     capacity: 50,
//     price: 0,
//     startDate: new Date('2023-12-31 20:00:00'),
//     endDate: new Date('2023-12-31 22:00:00')
//   },
//   {
//     venue:'234 Government Camp',
//     groupName: 'Hiking Team',
//     name: 'Spring Hike',
//     type: 'In person',
//     capacity: 10,
//     price: 10,
//     startDate: new Date('2024-4-1 20:00:00'),
//     endDate: new Date('2024-4-1 22:00:00')
//   },
//   {
//     venue:'34 NE 11th Street',
//     groupName: 'Book Club',
//     name: 'Twilight Reading',
//     type: 'Online',
//     capacity: 15,
//     price: 10,
//     startDate: new Date('2024-4-1 20:00:00'),
//     endDate: new Date('2024-4-1 22:00:00')
//   },

// ]


// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     for(let soloEvent of events){
//       const {venue,groupName,...eventDetails}=soloEvent

//       const foundVenue = await Venue.findOne({
//         where:{
//           address:venue
//         }
//       });
//       const foundGrp = await Group.findOne({
//         where:{
//           name:groupName
//         }
//       });
//       await Event.create({
//         venueId:foundVenue.id,
//         groupId:foundGrp.id,
//         ...eventDetails
//       }),
//       {validate:true}
//     }

//   },
//   async down(queryInterface, Sequelize) {
//     await queryInterface.bulkDelete('Events', { name: events.map(event => event.name) }, {});
//   }
// }
