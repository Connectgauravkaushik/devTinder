const mongoose = require("mongoose")

//connecting to cluster and return a promise

const connectDB = async()=> {
    await mongoose.connect("mongodb+srv://connectgauravkaushik:ion8nQyOjhKY4Vp6@namastenodejs.xrdgw.mongodb.net/devTinder")
}
module.exports = connectDB;