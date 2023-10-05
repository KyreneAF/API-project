'use strict';
const {EventImage,Event} = require('../models')
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
const eventImages =[
  {
    event:'Halloween Horror Movie Trivia',
    url:'url image1',
    preview:true

  },
  {
    event:'First Cheese Meeting',
    url:'url image2',
    preview:true

  },
  {
    event:'Meet and Greet',
    url:'url image3',
    preview:true

  },
  {
    event:'Spring Hike',
    url:'url image3',
    preview:true

  },
  {
    event:'Twilight Reading',
    url:'url image4',
    preview:false

  },
 

]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    for(let image of eventImages){
      const {event,...eventDetails} = image

      const foundEvent = await Event.findOne({
        where:{
          name:event
        }
      })
     await EventImage.create({
      eventId:foundEvent.id,
      ...eventDetails,
      },{validate:true})

    }
  },

  async down (queryInterface, Sequelize) {
  await queryInterface.bulkDelete('EventImages',{event:eventImages.map(img => img.event)},{})
  }
};
