const express = require("express");
const connectDB = require("./config/database");
const app = express(); // instance of express js application
const cookieParser = require("cookie-parser");
const cors = require('cors');
const http = require('http');
const initializeSocket = require("./utils/socket");

require('dotenv').config();

require('./utils/cronJob');

app.use(cors({
  origin: "http://localhost:5173",
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'], // Allow PATCH method
  credentials: true,

}));
app.options('*', cors());

app.use(cookieParser()); // make sure we get thje cookies in object , otherwise it will show undefined 
app.use(express.json()); //Middleware Convert JSON into js object.

// importing all the router 
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const chatRouter = require("./routes/chat");


// It checks for all the routes and controllers
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use('/', chatRouter);


// Creating a serer using HTTP
const server = http.createServer(app); // here app is existing express application 
initializeSocket(server);



// listening the request on this port number
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    server.listen(3000, () => {
      console.log("server is running");
    });
  })
  .catch((err) => {
    console.error("Database not connected successfully");
  });


