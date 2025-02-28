const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express(); // instance of express js application
app.use(express.json()); //Middleware Convert JSON into js object.



// SignUp API for a new user
app.post("/signup", async (req, res) => {
  // To add the new signup user , create need to create a new instance form the user model.
  // creating a new user instance of the model with the above data.
  const user = new User(req.body);
  try {
    // return a promise and save the data in the database / collection
    await user.save();
    res.send("user added successfully!!");
  } catch (error) {
    res.status(400).send("Error saving the user : " + error.message);
  }
});


// Get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.findOne({ emailId: userEmail });
    if (!users) {
      res.status(404).send("user not found !");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send("Somewthing went wrong!");
  }
});


//Feed API - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    // if empty object passed in fint it will get all the object
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("Somewthing went wrong!");
  }
});


//deleting a user form the database using _id 
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    // if empty object passed in fint it will get all the object
    const users = await User.findByIdAndDelete(userId);
    res.send("user Deleted successfully");
  } catch (error) {
    res.status(400).send("Somewthing went wrong!");
  }
});


//Updating the data in the database
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;

  try {
    const user = await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument: "after" })
    console.log(user);
    res.send("user Updated Successfully")

  } catch (error) {
    res.status(400).send("Somewthing went wrong!");
  }

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
