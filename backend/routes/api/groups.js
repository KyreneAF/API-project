const express = require('express');

const { Group, Membership, GroupImage, User,Venue,Attendance,Event} = require('../../db/models');
const{restoreUser} = require('../../utils/auth');
const{check,validationResult} = require('express-validator')
const {handleValidationErrors} = require('../../utils/validation')
const router = express.Router();
router.use(restoreUser);

const validCreateGroup = [
    check('name')
    .isLength({ max: 60 })
    .withMessage('Name must be 60 characters or less'),
    check('about')
    .isLength({ min: 50 })
    .withMessage('About must be 50 characters or more'),
    check('type')
    .isIn(['Online', 'In person'])
    .withMessage('Type must be "Online" or "In person"'),
    check('private')
    .isBoolean()
    .withMessage('Private must be a boolean'),
    check('city')
    .notEmpty()
    .withMessage('City is required'),
    check('state')
    .notEmpty()
    .withMessage('State is required'),

    handleValidationErrors,
  ];
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
/* POST image to groupId */
router.post('/:groupId/images', async (req, res) => {


    const id = req.params.groupId;

    const currentUserId = req.user.id

   const{url,preview} = req.body;


   const currGroup = await Group.findByPk(id)
   if(!currGroup || currGroup.organizerId !== currentUserId){
    return res.status(404).json({
        "message": "Group couldn't be found"
    })
}


       const createdImg = await GroupImage.create({
                groupId:id,
                url,
                preview,

        })
        const resObj = {
            id:createdImg.id,
            url:createdImg.url,
            preview:createdImg.preview
        }
        return res.json(resObj)

});



/* POST newVenue by groupId */
router.post('/:groupId/venues',validateCreateVenue, async(req,res) =>{
const grpId = req.params.groupId;
const currUser = req.user.id;

const groups = await Group.findByPk(grpId,{
    include: [
        {
            model: Membership,
            attributes: ['status']
        }
    ]
});
console.log(groups)
    if(!groups || currUser !== groups.organizerId || !groups.Memberships.some(stat => stat.status === 'co-host')){
        return res.status(404).json({
            "message": "Group couldn't be found"
            });
    }
    const errors = validationResult(req)
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

    const resVenue = await Venue.create({
        groupId:grpId,
        address:bodyPojo.address,
        city:bodyPojo.city,
        state:bodyPojo.state,
        lat:bodyPojo.lat,
        lng:bodyPojo.lng
    })
    const{id,groupId,address,city,state,lat,lng} = resVenue
    const resObj = {id,groupId,address,city,state,lat,lng}
    res.json(resObj)

})



/* POST group */

router.post('/',validCreateGroup, async(req,res) =>{
    const errors = validationResult(req);

    let {name,about,type,private,city,state} = req.body;
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
    };
    const userId = req.user.id;
    const createGroup = await Group.create({organizerId:userId,name,about,type,private,city,state})

    return res.status(201).json(createGroup)
})




/* PUT edit groupId */
router.put('/:groupId', async(req,res) =>{
    const currUser = req.user.id;
    const grpId = req.params.groupId

    let currGroup = await Group.findByPk(grpId)

    if(!currGroup || currGroup.organizerId !== currUser){
        return res.status(400).json(
            {
                "message": "Group couldn't be found"
              }
        )
    }
    const {name,about,type,private,city,state} = req.body;
    const [updatedGroup] = await Group.update(
        { name, about, type, private, city, state },
        { where: { id: grpId, organizerId: currUser } }
    );
    if (updatedGroup === 1) {
        currGroup = await Group.findByPk(grpId);
        return res.json(currGroup);
    }
})


/*Get all groups by user*/
// router.get('/current', restoreUser, async (req, res) => {
//    const id = req.user.id;

//    const groups = await Group.findAll({
//     include:[
//         {
//         model:GroupImage,
//         attributes:['url']
//         },{
//             model:Membership,
//             attributes:[],
//             whre:{
//                 userId:id
//             }
//         }]
//    });
//    const resGroups = groups.map((group) => ({
//     id: group.id,
//     organizerId: group.organizerId,
//     name: group.name,
//     about: group.about,
//     type: group.type,
//     private: group.private,
//     city: group.city,
//     state: group.state,
//     createdAt: group.createdAt,
//     updatedAt: group.updatedAt,
//     numMembers: group.Memberships,
//     previewImage: group.GroupImages[0].url
//   }));
//   res.json({Groups:resGroups})

// })
/*GET all venues at groupId */
router.get('/:groupId/venues',async(req,res) =>{
    const grpId = req.params.groupId;
    const currUser = req.user.id

    const groups = await Group.findByPk(grpId,{
            include: [
                {
                    model: Venue,
                    attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
                },
                {
                    model: Membership,
                    attributes: ['status']
                }
            ]
        });

    if(!groups || currUser !== groups.organizerId || !groups.Memberships.some(stat => stat.status === 'co-host'))
    return res.status(404).json({
        "message": "Group couldn't be found"
        });
        const allVenues = groups.Venues
        res.json({'Venues':allVenues})
})


/* GET by ID */
router.get('/:groupId',async(req,res) =>{
    const id = req.params.groupId

    const numMembersSum = await Membership.count({
        col: 'userId', // Count distinct users
        where: {
            groupId: id,
            status: 'member'
        }
    });
    const group = await Group.findByPk(id,{
        include: [
            {
              model: GroupImage,
              attributes: ['id', 'url', 'preview'],
            },
            {
              model: User,
              as:'Organizer',
              attributes: ['id', 'firstName', 'lastName'],
            },
            {
              model: Venue,
              attributes: ['id','groupId','address','city','state','lat','lng'],
            },
          ],

        });
        if(!group){
            res.status(404)
            return res.json({
                "message": "Group couldn't be found",
            })
        }
        const groupPojo = group.toJSON();
      const resGroup = {
         ...groupPojo,
            numMembers: numMembersSum
        }

       return res.json(resGroup)

});


/* Get all*/
router.get('/', async(req,res)=>{
    const numMembersSum = await Membership.sum('id');

    const allGroups = await Group.findAll({
            include:[{
                model:GroupImage,
                attributes:['url']
            }],
    });
    if(!allGroups){
        res.status(404)
        return res.json({
            "message": "Group couldn't be found",
        })}

    const resGroup = allGroups.map(grp =>{
        let img;
        grp = grp.toJSON();
        if(grp.GroupImages[0]){ img = grp.GroupImages[0].url};

        console.log(grp.GroupImages[0].url)
        return{
            id:grp.id,
            organizerId:grp.organizerId,
            name:grp.name,
            about:grp.about,
            type:grp.type,
            private:grp.private,
            city:grp.city,
            state:grp.state,
            createdAt:grp.createdAt,
            updatedAt:grp.updatedAt,
            numMembers:numMembersSum,
            previewImage: img
        }
    })

    res.json(resGroup)

})
/* DELETE a group */
router.delete('/:groupId', async (req,res) =>{
    const grpId = req.params.groupId;
    const userId = req.user.id;
    const currGroup = await Group.findByPk(grpId);

    console.log(currGroup)
    if(!currGroup || currGroup.organizerId !== userId){
        return res.status(404).json({ "message": "Group couldn't be found"});

    }
    await currGroup.destroy();

       return res.json({
            "message": "Successfully deleted"
        })

})




module.exports = router
