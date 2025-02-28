const mongoose = require("mongoose")

//connecting to cluster and return a promise

const connectDB = async()=> {
    await mongoose.connect("")
}
module.exports = connectDB;