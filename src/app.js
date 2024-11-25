//sabse phele express ka instance leke aya hu mai
const express =  require("express");
const app = express(); 
const {validateSignUpData, validateLogInData} =  require("./utils/validation");
const bcrypt = require("bcrypt");

//schema export kar liya hai
const User = require("./models/user");


//i have to include this middleware because this middleware is helping me to convert the json request(which we are send this postman) into javascrict object , so that we can use that data which is sending through request.
//basically we are using this middleware to parse the data from request body=> 
app.use(express.json());


//this is cretaing post api: for signIn purpose:
app.post("/signup" , async (req,res)=>{
     
   
    try{
        //data validation:(for new user to register)
       validateSignUpData(req);


       const {password , lastName , emailId, firstName} = req.body;
       
       //Encrypting the password:(forsecurity purpose)
       
       const passwordHash = await bcrypt.hash(password , 10);
       console.log(passwordHash);


       //creating a new instance of a User model=>
       const user = new User({
        firstName, 
        lastName , 
        password:passwordHash, 
        emailId
    });
       await user.save();
       res.send("User added successfully").status(200);
    }
    catch(err){
       res.status(500).send("error in saving user: " + err.message);
    }
   

});



//this is login API - (POST type)
app.post("/login" , async(req,res)=>{
     try{
        validateLogInData(req);

        const {emailId , password} = req.body;

        //checking weather the email exist in DB or not
        const userInfo = await User.findOne({emailId: emailId});
        if(!userInfo){
            throw new Error("email not present , signUp first: ");
        }

        const isPasswordValid = await bcrypt.compare(password , userInfo.password);
        if(!isPasswordValid){
            throw new Error("password not match: ")
        }

        res.send("loggin Successfull!!!")
     }
     catch(err){
        res.status(400).send("ERROR " + err.message );
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
app.patch("/updateUser/:_id" , async(req,res)=>{
    const userId = req.params?._id;
    const data = req.body;

    

    try{

         const allowed_Updates = [ "photoUrl", "about","gender", "age", "skills", "lastName"];
         const isUpdateAllow = Object.keys(data).every((k)=>
             allowed_Updates.includes(k)
         );

         if(!isUpdateAllow){
            throw new Error("Update not allowed");
         }
         
        
        //  u can also write "userId" only,  insted of  "_id:userId" in curly brackets in below line.
        const user = await User.findByIdAndUpdate({_id:userId} , data , {runValidators:true});
        // console.log(user);
        res.send("user updated successfully");
        
    }
    catch(err){
        res.status(400).send("error while updating user: " + err.message);
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