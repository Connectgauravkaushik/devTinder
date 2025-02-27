const mongoose = require("mongoose");

//simply use this to create schema
const userSchema = new mongoose.Schema({
  // here we will pass all the parameter which define user.
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
});

//Now we create a mongoose model , model is a class create it's own instances when a new user comes
// this model help in creating the new users.

const User = mongoose.model("user", userSchema);
module.exports = User;
