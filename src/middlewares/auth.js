const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Read the token from request cookies , validate the token and find the user.
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies; // authenticate using the cookie 
    if(!token){
        throw new Error("Token is not valid !!")
    }
    //validate the token , before showing the profile or giving the access of profile.
    const decodedObj = await jwt.verify(token, "DEV@TINDER$79g=G");
    const { _id } = decodedObj;

    const user = await User.findById(_id); // GEETING THE USER BY ID FROM DB
    if (!user) {
      throw new Error("please login again , user not exist !");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  userAuth,
};
