//sabse phele express ka instance leke aya hu mai
const express =  require("express");
const app = express(); 



//schema export kar liya hai
const User = require("./models/user");


//i have to include this middleware because this middleware is helping me to convert the json request(which we are send this postman) into javascrict object , so that we can use that data which is sending through request.
//basically we are using this middleware to parse the data from request body=> 
app.use(express.json());



app.post("/signup" , async (req,res)=>{
     
    //creating a new instance of a User model=>
    const user = new User(req.body);
    try{
        await user.save();
        res.send("User added successfully").status(200);
    }
    catch(err){
        res.status(500).send("error in saving user" + err.message);
    }
   

});






//connecting  database
const database = require("./config/database");
database()
  .then(()=>{
    console.log("DB connect Successfully");
    app.listen(3000 , ()=>{
        console.log("server is successfully listning on port 3000")
    });
  })
  .catch((err)=>{
    console.error("DB connection ISSUE!!!");
    console.log(err);
  })






//gIAxtWYB5507FAfN