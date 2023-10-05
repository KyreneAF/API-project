const express = require('express');

const {Venue} = require('../../db/models');
const{restoreUser} = require('../../utils/auth');
const{check,validationResult} = require('express-validator')
const {handleValidationErrors} = require('../../utils/validation');


const router = express.Router();
router.use(restoreUser);

/* PUT */
router.put('/:venueId',async(req,res) =>{
    const 
})
