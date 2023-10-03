'use strict';

const { Event, Group, Venue } = require('../models');

const events = [
  {
    ven: '123 Sunny rd.',
    groupName: 'Trivia Night',
    name: 'Halloween Horror Movie Trivia',
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
    type: 'Online',
    capacity: 15,
    price: 10,
    startDate: new Date('2024-04-01T20:00:00'),
    endDate: new Date('2024-04-01T22:00:00'),
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      for (let eventData of events) {
        const { ven, groupName, ...eventDetails } = eventData;

        // Find or create the Venue
        const [foundVenue] = await Venue.findOrCreate({
          where: { address: ven },
        });

        // Find or create the Group
        const [foundGroup] = await Group.findOrCreate({
          where: { name: groupName },
        });

        // Create the Event
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
    try {
      for (let attend of attendances) {
        const { eventName, user, status } = attend;

        const foundEvent = await Event.findOne({
          where: {
            name: eventName,
          },
        });

        const foundUser = await User.findOne({
          where: {
            username: user,
          },
        });

        await Attendance.destroy({
          where: {
            eventId: foundEvent.id,
            userId: foundUser.id,
            status,
          },
        });
      }

      console.log('Seed data deleted successfully.');
    } catch (error) {
      console.error('Error deleting seed data:', error);
      throw error;
    }
  },
};
