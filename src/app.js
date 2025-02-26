const express = require('express');
const { adminAuth ,userAuth} = require('./middlewares/auth');
const app = express();// instance of express js application

app.use("/admin", adminAuth)

app.get("/user",userAuth, (req, res) => {
    res.send("user Data Called!")
})

app.get("/admin/getAllData", (req, res) => {
    res.send("Getting all the user data for admin!");
})

app.delete("/admin/deletingAllUserData", (req, res) => {
    res.send("Deleting all the user data for admin!");
})

// listening the request on this port number
app.listen(3000, () => {
    console.log("server is running");
});


