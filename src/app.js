const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express(); // instance of express js application

app.post("/signup", async (req, res) => {
  // To add the new signup user , create need to create a new instance form the user model.
  // creating a new user instance of the model with the above data.
  const user = new User({
    firstName: "Gaurav",
    lastName: "kaushik",
    emailId: "gauravkaushik415@gmail.com",
    password: "gaurav@1234",
  });
  try {
    // return a promise and save the data in the database / collection
    await user.save();
    res.send("user added successfully!!");
  } catch (error) {
    res.status(400).send("Error saving the user : " + error.message);
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
