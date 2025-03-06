const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequests");
const userRouter = express.Router();

//GET ALL THE PENDING CONNECTION REQUEST FOR THE LOGGED IN USER 
userRouter.get('/user/requests/received', userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,//logged in user id's === to user id,
            status: 'interested'
        }).populate('fromUserId', ['firstName', 'lastName', "photoUrl", 'age', 'gender', 'about', 'skills']);


        res.json(
            { message: "Data Fetched Successfully", data: connectionRequests, }
        );

    } catch (error) {
        res.status(400).send('ERROR', + error.message);
    }
});

// give me the information of who has accepted my request
userRouter.get('/user/connections', userAuth, async (req, res) => {

    try {
        //
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: 'accepted' },
                { fromUserId: loggedInUser._id, status: 'accepted' },
            ],
        }).populate('fromUserId', ['firstName', 'lastName', "photoUrl", 'age', 'gender', 'about', 'skills']);
        const data = connectionRequests.map((row) => row.fromUserId);
        res.json({ data: data });

    } catch (error) {
        res.status(400).send('ERROR', + error.message);
    }
})


module.exports = userRouter;