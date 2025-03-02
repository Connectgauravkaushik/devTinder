const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express(); // instance of express js application
const bcrypt = require("bcrypt")// bcrypt to encrypt the pswrd
app.use(express.json()); //Middleware Convert JSON into js object.

const { validateSignUpData } = require("./utils/validation")



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


app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res.send("User logged in successfully");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send("Error saving the user : " + error.message);
  }
})

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
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "userId",
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];

    const invalidUpdates = Object.keys(data).filter(
      (key) => !ALLOWED_UPDATES.includes(key)
    );

    if (data?.skills?.length > 5) {
      throw new Error("Skills cannot be more than 5");
    }

    // If there are invalid fields, throw an error
    if (invalidUpdates.length > 0) {
      throw new Error(
        `Update not allowed for the following fields: ${invalidUpdates.join(
          ", "
        )}`
      );
    }

    // Proceed to update the user
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });

    console.log(user);
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send("Update failed: " + error.message);
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
