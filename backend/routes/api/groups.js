const express = require('express');

const { Group, Membership, GroupImage, User,Venue,Attendance,Event} = require('../../db/models');
const{restoreUser} = require('../../utils/auth');
const{check,validationResult} = require('express-validator')

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
  ];
/* POST image to groupId */
router.post('/:groupId/images', async (req, res) => {
    const id = req.params.groupId;

    const currentUserId = req.user.id

   const{url,preview} = req.body;


   const currGroup = await Group.findByPk(id)
   console.log(currGroup,'!!!!!!')

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




/* POST group */
router.post('/', async(req,res) =>{
    const errors = validationResult(req);
    console.log(errors.param)
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
    currGroup = await Group.create({organizerId:currUser,name,about,type,private,city,state});
    res.json(currGroup)

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

    if(!currGroup || currGroup.organizerId !== userId){
        return res.status(404).json({ "message": "Group couldn't be found"});

    }
    

})


module.exports = router
