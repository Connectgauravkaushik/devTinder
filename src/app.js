const express = require("express");
const connectDB = require("./config/database");
const app = express(); // instance of express js application
const cookieParser = require("cookie-parser");


app.use(cookieParser()); // make sure we get thje cookies in object , otherwise it will show undefined 
app.use(express.json()); //Middleware Convert JSON into js object.

// importing all the router 
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

// It checks for all the routes and controllers
app.use("/" ,authRouter); 
app.use("/" ,profileRouter);
app.use("/" ,requestRouter);
app.use("/" ,userRouter);

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


  