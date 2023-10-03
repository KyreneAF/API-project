'use strict';
const {GroupImage,Group} = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
const groupImages =[
  {
    group:'Trivia Night',
    url:'url groupImg1',
    preview:false

  },
  {
    group:'Cheese Tasting',
    url:'url groupImg2',
    preview:false

  },
  {
    group:'Kitty social',
    url:'url groupImg3',
    preview:false

  },
  {
    group:'Hiking Team',
    url:'url groupImg4',
    preview:false

  },
  {
    group:'Book Club',
    url:'url groupImg4',
    preview:true

  }
]


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    for(let img of groupImages){
      const {group,...groupImgDetails} = img;

      const foundGrp = await Group.findOne({
        where:{
          name:group
        }
      })
      await GroupImage.create({
        groupId:foundGrp.id,
        ...groupImgDetails
      })
    }

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('GroupImages',{group:groupImages.map(img => img.group)})
  }
};
