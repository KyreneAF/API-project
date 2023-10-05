const express = require('express');

const {Venue,Group,Membership} = require('../../db/models');
const{restoreUser} = require('../../utils/auth');
const{check,validationResult} = require('express-validator')
const {handleValidationErrors} = require('../../utils/validation');
const membership = require('../../db/models/membership');


const router = express.Router();


const validateCreateVenue =[
    check('address')
    .notEmpty()
    .withMessage("Street address is required"),
    check('city')
    .notEmpty()
    .withMessage("City is required"),
    check('state')
    .notEmpty()
    .withMessage("State is required"),
    check('lat')
    .isDecimal()
    .withMessage("Latitude is not valid"),
    check('lng')
    .isDecimal()
    .withMessage("Longitude is not valid"),
    handleValidationErrors,
  ]

/* PUT */
router.put('/:venueId',validateCreateVenue, async (req, res) => {
    const venId = req.params.venueId;
    const userId = req.user.id;

    const venue = await Venue.findByPk(venId, {
      include: {
        model: Group,
        attributes: ['id', 'organizerId']
      }
    });

    const member = await Membership.findByPk(venue.groupId);
   
    if (!venue || venue.Group.organizerId !== userId || member.status !== 'co-host') {
      return res.status(400).json({ "message": "Venue couldn't be found or unauthorized" });
    }
    const errors = validationResult(req);

        if(!errors.isEmpty()){
        const resObj = errors.array().reduce((acc, error) => {
            acc[error.param] = error.msg;
            return acc;
          }, {});
        res.status = 400;
        return res.json({
            message:'Bad Request',
            errors:resObj
        })
    }

    const bodyPojo = req.body;

      await venue.update({
        address: bodyPojo.address,
        city: bodyPojo.city,
        state: bodyPojo.state,
        lat: bodyPojo.lat,
        lng: bodyPojo.lng
      });

      const updatedVenue = await Venue.findByPk(venId, {
        attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
      });

      res.json(updatedVenue);
    })



module.exports = router
