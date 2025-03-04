const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express(); // instance of express js application
const bcrypt = require("bcrypt")// bcrypt to encrypt the pswrd
const { validateSignUpData } = require("./utils/validation")
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {userAuth} = require('./middlewares/auth');

app.use(cookieParser())
app.use(express.json()); //Middleware Convert JSON into js object.


// SignUp API for a new user
app.post("/signup", async (req, res) => {

  // - Encrypt the password
  const { firstName, lastName, emailId, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10)

  // To add the new signup user , create need to create a new instance form the user model.
  const user = new User({
    firstName,
    lastName,
    emailId,
    password: passwordHash
  });   // creating a new user instance of the model with the above data.

  try {
    validateSignUpData(req)  // Validation of data 
    await user.save(); // return a promise and save the data in the database / collection
    res.send("user added successfully!!");

  } catch (error) {
    res.status(400).send("Error saving the user : " + error.message);
  }
});


// LOGIN API 
app.post("/login", async (req, res) => {
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
      res.cookie('token', token , {expires : new Date( Date.now() +  8 * 3600000)});
      res.send("User logged in successfully");

    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send("Error saving the user : " + error.message);
  }
});


// PROFILE API WITH COOKIE AUTH 
app.get('/profile', userAuth ,async (req, res) => {

try {
  const user  = req.user;
  res.send(user);
} catch (error) {
  res.status(400).send("ERROR" + error.message);
}

});


// SENDING THE CONNECTION REQUEST 
app.post("/sendconnectionRequest" , userAuth , async (req , res) => {
  const user  = req.user;
    console.log("Sending a connection Request !");
    res.send( user.firstName + " -> Sent the Connection Request !");
});




// listening the request on this port number
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("server is running");
    });
  })
  .catch((err) => {
    console.error("Database not connected successfully");
  });
