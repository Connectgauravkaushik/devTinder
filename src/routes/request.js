const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/user");
const { connection } = require("mongoose");
const requestRouter = express.Router();

const sendEmail = require('../utils/sendEmail');


// SENDING THE CONNECTION REQUEST
requestRouter.post(
  "/request/send/:status/:touserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id; // I can get the id from the logged in user _id
      const toUserId = req.params.touserId;
      const status = req.params.status; // making the status dynamic

      const allowedStatus = ["interested", "ignore"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "invalid status type:" + status });
      }

      const toUser = await User.findById(toUserId); // find the sender id is valid or not or present or not
      if (!toUser) {
        return res.status(400).json({ message: "user not found" });
      }
      // check if there is an existing request or not
      const existingConnectionRequest = await ConnectionRequest.findOne({
        // or is using whetther elon has send the request or not , or sachin has already send the request or not , vice versa

        $or: [
          { fromUserId, toUserId }, //already exist or not
          { fromUserId: toUserId, toUserId: fromUserId }, // checks inside fromyuserId already has the request from touserid or not and vice versa.
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection Request already exist" });
      }

      // creating a new instance of connection Request
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      const emailRes = await sendEmail.run();
      console.log(emailRes);
      res.json({
        message: req.user.firstName + "is" + status + "in" + toUser.firstName,
        data,
      });
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  }
 );



// reviewing API the requests send by the user 
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    /* 
  - make sure all the corner cases will be covered 
  */

    try {
      const loggedInUser = req.user;
      const status = req.params.status;
      const requestId = req.params.requestId;
      console.log(status);
      // Validate the status
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "invalid status type:" + status });
      }

      //Check whether the request id is presend or not in DB.
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId, // user whose request we are accepting it
        toUserId: loggedInUser._id, // it's the logged in user Id
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection request not found " });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.status(200).json({ message: "Connection request" + status, data });
    } catch (error) {
      res.status(400).send("ERROR", +error.message);
    }
  }
);



module.exports = requestRouter;
