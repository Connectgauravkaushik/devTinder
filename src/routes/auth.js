const express = require("express");
const authRouter = express.Router(); // we importrouter
const User = require("../models/user");
const bcrypt = require("bcrypt"); // bcrypt to encrypt the pswrd
const { validateSignUpData } = require("../utils/validation");

// SignUp API for a new user
authRouter.post("/signup", async (req, res) => {
  // - Encrypt the password
  const { firstName, lastName, emailId, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);

  // To add the new signup user , create need to create a new instance form the user model.
  const user = new User({
    firstName,
    lastName,
    emailId,
    password: passwordHash,
  }); // creating a new user instance of the model with the above data.

  try {
    validateSignUpData(req); // Validation of data
    const savedUser = await user.save(); // return a promise and save the data in the database / collection
    const token = await savedUser.getJWT(); // offloads to the schmea for getting the token
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    
    res.json({message : "User Added Successfully" , data : savedUser});
  } catch (error) {
    res.status(400).send("Error saving the user : " + error.message);
  }
});

// LOGIN API
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // Hiding the user ID after authentication and a SECRET KEY
      const token = await user.getJWT(); // offloads to the schmea for getting the token
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send("Error saving the user : " + error.message);
  }
});


// Logout API
authRouter.post("/logout", async (req, res) => {
  // JUST MAKING TOKEN NULL WILL LOGOUT YOU
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("user logout !");
});



module.exports = authRouter;
