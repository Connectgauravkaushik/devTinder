const express = require('express')
const app = express();// instance of express js application

// app.route("/route" , [rp1 , rp2 ,rp3])
// app.route("/route" , [rp1 , rp2] ,rp3)

app.get("/user", (req, res, next) => {
    console.log("1st Route Handler")
    next();
    res.send("1nd Route Handler");
}, (req, res) => {
    console.log("2nd Route Handler")
    res.send("2nd Route Handler");
}
);


// listening the request on this port number
app.listen(3000, () => {
    console.log("server is running");
});


