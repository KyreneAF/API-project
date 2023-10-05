'use strict';
const {Attendance,Event,User} = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
const attendances =[
  {
    eventName:'Halloween Horror Movie Trivia',
    user:'brandon-Flores',
    status:'attending'
  },
  {
    eventName:'First Cheese Meeting',
    user:'sashaFlores1',
    status:'attending'
  },
  {
    eventName:'Meet and Greet',
    user:'CaskaFlores2',
    status:'waitlist'
  },
  {
    eventName:'Spring Hike',
    user:'CaskaFlores2',
    status:'pending'
  },
  {
    eventName:'Twilight Reading',
    user:'HollyFlores1',
    status:'attending'
  },

]


module.exports = {
  async up (queryInterface, Sequelize) {
    for(let attend of attendances){
      const {eventName,user,status} = attend;

      const foundEve = await Event.findOne({
        where:{
          name:eventName
        }
      })
      const foundUse = await User.findOne({
        where:{
          username:user
        }
      })
      Attendance.create({
        eventId:foundEve.id,
        userId: foundUse.id,
        status
      },{validate:true})
    }

  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete(options,{eventId: attendances.map(attend =>attend.eventName)},{})
  }
};
