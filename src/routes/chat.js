const express = require('express');
const { Chat } = require('../models/chat');
const { userAuth } = require('../middlewares/auth');

const chatRouter = express.Router();


// getting the data from chat
chatRouter.get('/chat/:targetUserId',userAuth, async (req, res) => {

    const { targetUserId } = req.params;
    const userId = req.user._id;

    try {
        
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] }
        }).populate({
            path:"messages.senderId",
            select: "firstName , lastName",
        });
        
        if(!chat){
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: [],
              });
            
        }

        await chat.save();

        res.json(chat)

    } catch (error) {
        res.status(400).json('Error saving the messages')
    }




});



module.exports = chatRouter;