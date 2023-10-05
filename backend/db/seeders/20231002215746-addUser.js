'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'brandon@gmail.com',
        username: 'brandon-Flores',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'Brandon',
        lastName: 'Flores'
      },
      {
        email: 'sasha@gmail.com',
        username: 'sashaFlores1',
        hashedPassword: bcrypt.hashSync('password2'),
        firstName: 'Sasha',
        lastName: 'Flores'
      },
      {
        email: 'caska@gmail.com',
        username: 'CaskaFlores2',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: 'Caska',
        lastName: 'Flores'
      },
      {
        email: 'jet@gmail.com',
        username: 'JetFlores1',
        hashedPassword: bcrypt.hashSync('password4'),
        firstName: 'Jet',
        lastName: 'Flores'
      },{
        email: 'holly@gmail.com',
        username: 'HollyFlores1',
        hashedPassword: bcrypt.hashSync('password4'),
        firstName: 'Holly',
        lastName: 'Flores'
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['brandon-Flores', 'sashaFlores1', 'CaskaFlores2','JetFlores1','HollyFlores1'] }
    }, {});
  }
};


