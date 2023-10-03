'use strict';
const {Event} = require('../models')

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
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
