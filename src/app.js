const express = require('express') 
const app = express();// instance of express js application

app.use("/test",(req, res)=> {
    res.send("Hello from the server !");
})

app.use("/hello",(req, res)=> {
    res.send("Hello Hello hello");
})

app.use("/",(req, res)=> {
    res.send("Dashboard");
})

// listening the request on this port number
app.listen(3000,()=>{
    console.log("server is running");
}); 


