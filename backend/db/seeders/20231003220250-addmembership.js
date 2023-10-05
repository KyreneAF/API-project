'use strict';

const { User, Group,Membership } = require('../models');
// const{ Membership} = require('../models/membership');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const memberships =[
  {
    usId: 'brandon-Flores',
    grId: 'Trivia Night',
    status:'member'

  },
  {
    usId: 'sashaFlores1',
    grId: 'Cheese Tasting',
    status:'co-host'

  },
  {
    usId: 'CaskaFlores2',
    grId: 'Kitty social',
    status:'member',

  },
  {
    usId: 'JetFlores1',
    grId: 'Hiking Team',
    status:'member'

  },
  {
    usId: 'HollyFlores1',
    grId: 'Book Club',
    status:'co-host'

  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      for (let mems of memberships) {
        const { usId,grId, ...memDetails } = mems;

        const foundUs = await User.findOne({
          where: { username: usId },
        });
        const foundG = await Group.findOne({
          where:{name:grId}
        })

        await Membership.create({
          userId: foundUs.id,
          groupId:foundG.id,
          ...memDetails,
        }, {validate:true})

      }

      console.log('Seed data inserted successfully.');
    } catch (error) {
      console.error('Error seeding data:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
   return await queryInterface.bulkDelete(options, { name: memberships.map(member => member.usId) }, {});
  }
};
