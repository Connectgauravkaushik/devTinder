const express = require("express");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const validator = require("validator");

// PROFILE API WITH COOKIE AUTH
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR" + error.message);
  }
});

//Updating the profile info
profileRouter.put("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request!");
    }
    const loggedInUser = req.user;

    //make sure loggedInuser keys and request body key is equal
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save(); // save the data in database and return promise as it's instance of User.

    res.json({
      message: `${loggedInUser.firstName} profile updated Successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});


//UPDATING THE PASSWORD 
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { currentPassword, newPassword } = req.body;
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      req.user.password
    ); // comparing the password in hash and current one

    if (!isPasswordValid) {
      throw new Error("password not correct");
    }

    // validator lib checks if the password is valid or not !
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Enter a Strong password !");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10); // hashing the new password
    loggedInUser.password = passwordHash; // saving the password for the login in user

    await loggedInUser.save(); // saving the password in the database

    res.json({ data: loggedInUser });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

module.exports = profileRouter;
