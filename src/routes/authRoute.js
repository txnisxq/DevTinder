const express = require("express");
const authRouter = express.Router();
const {validateSignUpData, validateLogInData} =  require("../utils/validation");

//schema export kar liya hai
const User = require("../models/user");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");



authRouter.post("/signup" , async (req,res)=>{
     
   
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


authRouter.post("/login" , async(req,res)=>{
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


       //creating a JWT token after compareing that password that i entered while logIn is equal to password that already exist in DB=>
       //this token is created and send by server to client , when client loggs In successfully:
       const token = await jwt.sign({_id:userInfo._id} , "Tanishq@123");
       // console.log(token);

       res.cookie("token" , token);
       // console.log("TOKEN: " + token);
       res.send("loggin Successfull!!!")
    }
    catch(err){
       res.status(400).send("ERROR " + err.message );
    }
});


authRouter.post("/logout" , async(req,res)=>{
     //logout ke liye simple logice hai , bas cookies mai token ko null karke expire now kardo.
     res.cookie("token" , null , {expires: new Date(Date.now())});

     res.send("Logout Successfully");
});

module.exports = authRouter;