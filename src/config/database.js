//for connecting database to backend we use a library know as "MONGOOSE"
//maine yaha apne mongoose library install kari , phir mongoose library ki help se maine apne cluster(database) ki ko yaha server(backend) se link kar diya.
const mongoose = require("mongoose");

const connectDB = async() =>{
    await mongoose.connect("mongodb+srv://tanishqjain23112001:gIAxtWYB5507FAfN@cluster2.kv4xv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2/devTinderDB")
    
}; 

module.exports =  connectDB;