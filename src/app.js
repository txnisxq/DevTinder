//sabse phele express ka instance leke aya hu mai
const express =  require("express");
const app = express(); 



//schema export kar liya hai
const User = require("./models/user");


//i have to include this middleware because this middleware is helping me to convert the json request(which we are send this postman) into javascrict object , so that we can use that data which is sending through request.
//basically we are using this middleware to parse the data from request body=> 
app.use(express.json());


//this is cretaing post api: for signIn purpose:
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



//getting useer by email:
app.get("/user" , async (req , res)=>{

    const userEmail = req.body.emailId;

    try{
        // console.log(userEmail);
       const user = await User.findOne({emailId:userEmail});
       if(!user){
        res.send("User not found");
       }
       else{
        res.send(user);
       }
       
    }
    catch(err){
        res.status(400).send("something went wrong" + err.message);
    }
});
 


//now i am creating a feed API : to get all the users from the database:
app.get("/feed" , async(req,res)=>{
    
    try{
        const users = await User.find({}); 
        console.log(users);
        if(!users){
            res.send("User not found");
        }
        else{
            res.send(users);
        }
    }
    catch(err){
        res.status(400).send("something went wrong" + err.message);
    }

});



//delete a data from the data base
app.delete("/deleteUser", async(req,res)=>{
    
    const userId = req.body._id;
    try{
        if(!userId){
           res.send("user does not exist");
        }
        else{
            // await User.findByIdAndDelete({userId});      u can also write "userId" only  insted of  "_id:userId" in curly brackets in below line.
            await User.findByIdAndDelete({_id:userId});
            res.send("userId deleted successfully");
        }
        
    }
    catch(err){
         res.status(404).send("error while deleting user");
    }
    
});




//update data of a user 
app.patch("/updateUser" , async(req,res)=>{
    const userId = req.body._id;
    const data = req.body;

    try{
        if(!userId){
            res.send("user not found")
        }
        else{
            //  u can also write "userId" only,  insted of  "_id:userId" in curly brackets in below line.
            const user = await User.findByIdAndUpdate({_id:userId} , data , {runValidators:true});
            res.send("user updated successfully");
        }
        
    }
    catch(err){
        res.status(400).send("error while updating user");
    }
})






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