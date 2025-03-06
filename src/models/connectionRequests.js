const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  // status , from and to user_id
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId, // Here _id is of type this
      ref:"user", // Creating a link between two tables like refrence to user collection
      required: true,
    },

    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      // We create enum when we want the user to restrict from some values like status should of only 4 types
      enum: {
        values: ["ignore", "interested", "accepted", "rejected"],
        message: "${Value} is incorrect status type",
      },
    },
  },
  {
    timestamps: true,
  }
);

// if i will ever do connectionRequest.find({fromUserId :56115645561115645156 , toUserId:5615685655611})
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// new Concept , Schema Validation
// kind of middlerware , whenever we call save method on api , it will be called before saving it.
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  //check if the fromUserId same as userId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error('cannot send connection request to yourself');
  }

  //to move the code a head MANDATORY
  next();
})


const ConnectionRequest = new mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);
module.exports = ConnectionRequest;
