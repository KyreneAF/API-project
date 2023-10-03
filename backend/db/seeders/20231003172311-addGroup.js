'use strict';

const { User, Group } = require('../models');

const groups = [
  {
    user: 'brandon-Flores',
    name: 'Trivia Night',
    about: 'Weekly trivia night at your favorite pub.',
    type: 'In person',
    private: true,
    city: 'Dallas',
    state: 'TX',
  },
  {
    user: 'sashaFlores1',
    name: 'Cheese Tasting',
    about: 'Enjoy an evening of tasting a variety of imported cheese and wine.',
    type: 'In person',
    private: true,
    city: 'Phoenix',
    state: 'AZ',
  },
  {
  user: 'CaskaFlores2',
  name: 'Kitty social',
  about: 'Join our zoom call to discuss your favorite furry friends.',
  type: 'Online',
  private: false,
  city: 'Phoenix',
  state: 'AZ',
},
{
user: 'JetFlores1',
name: 'Hiking Team',
about: 'Come hike our amazing local trails.',
type: 'In person',
private: true,
city: 'Portland',
state: 'OR',
},
{
  user: 'HollyFlores1',
  name: 'Book Club',
  about: 'Join our group of book lovers for weekly chapter discussions',
  type: 'Online',
  private: true,
  city: 'Miami',
  state: 'FL',
  }
];

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      for (let soloGroup of groups) {
        const { user, ...groupDetails } = soloGroup;

        const foundUser = await User.findOne({
          where: { username: user },
        });

        await Group.create({
          organizerId: foundUser.id,
          ...groupDetails,
        });
      }

      console.log('Seed data inserted successfully.');
    } catch (error) {
      console.error('Error seeding data:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Groups', { name: groups.map(group => group.name) }, {});
  }
};
