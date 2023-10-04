const express = require('express');

const router = express.Router();

const { Group, Membership, GroupImage, User,Venue} = require('../../db/models');

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



module.exports = router
