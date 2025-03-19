const mongoose = require("mongoose");

/*
Creating a different Schema for the messages and 
 then we will combine it with the chat schmea
*/

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId, // Here _id is of type this
      ref: "user",
      required: true,
    },
  ],
  messages : [messageSchema] // type of messages is different message schema
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = { Chat };
