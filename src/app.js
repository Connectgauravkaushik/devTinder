const express = require('express')
const app = express();// instance of express js application



app.get("/user", (req, res) => {
    res.send({firstName:"Gaurav" , lastName:"Kaushik"});
});

app.post("/user" , (req , res)=>{
    res.send("Data saved successfully !");
})

app.delete("/user" , (req , res)=>{
    res.send("user Deleted successfully");
})

app.use("/test", (req, res) => {
    res.send("Hello from the server !");
});


// listening the request on this port number
app.listen(3000, () => {
    console.log("server is running");
});


