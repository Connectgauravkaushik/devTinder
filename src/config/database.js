const mongoose = require("mongoose")

//connecting to cluster and return a promise

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://" + process.env.DATABASE_USERNAME + ":" + process.env.DATABASE_PSWRD + "@namastenodejs.xrdgw.mongodb.net/devTinder")
}
module.exports = connectDB;
