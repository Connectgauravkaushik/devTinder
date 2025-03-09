const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/user");
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

        }).populate('fromUserId', ['firstName', 'lastName', "photoUrl", 'age', 'gender', 'about', 'skills'])
            .populate('toUserId', ['firstName', 'lastName', "photoUrl", 'age', 'gender', 'about', 'skills']);

        // checking if the login user is equal to the user id who has send the request.
        const data = connectionRequests.map((row) => {
            //to string will check the strings of id's 
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        }
        );


        res.json({ data: data });

    } catch (error) {
        res.status(400).send('ERROR', + error.message);
    }
});

// fetching all the users data
userRouter.get('/feed', userAuth, async (req, res) => {
    
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1; // converting string into number 
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;  // fetch max to max 50 users.
        const skip = (page - 1) * limit;

        // Find All the connection requests either i have sent or they have recieved 
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                //  Either from (loggedInuser who has send the request) or to ( the user who has recieved the requests).
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ],
        }).select("fromUserId toUserId");

        // Hide connectionRequests user from feed which has sent or recieved request
        // Like an array and only unique users will be added , no repeation is allowed.
        const hideUsersFromFeed = new Set();
        connectionRequests.forEach(req => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        // fetching all the user whose id is not present in my hideUserFromFeed array 
        const users = await User.find({
            //Both the Condition should be true
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } }, // nin is not be 
                { _id: { $ne: loggedInUser._id } }, // not equal is ne ,dont want my own card as well.

            ],

        }).select(['firstName', 'lastName', "photoUrl", 'age', 'gender', 'about', 'skills']).skip(skip).limit(limit) // ;

        res.send(users);
        console.log(hideUsersFromFeed);


    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


module.exports = userRouter;