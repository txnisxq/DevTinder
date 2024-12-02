const express = require("express");
const profileRouter = express.Router();

//schema export kar liya hai
const User = require("../models/user");

const {userAuthentication} = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation");

//route and controller for viewing our profile
profileRouter.get("/profile/view" ,userAuthentication, async(req,res)=>{
      
    const user = req.user;

    res.send(user);
});



//route and controller for editing our profile
profileRouter.patch("/profile/edit" ,userAuthentication, async(req,res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request!!! ");
        } 

        const loggedInUser = req.user;
        console.log(loggedInUser);

        Object.keys(req.body).forEach((key)=>(loggedInUser[key] = req.body[key]));
        console.log(loggedInUser);
        await loggedInUser.save();

        res.send(`${loggedInUser.firstName} profile is edited successfully`);
    }
    catch(err){
         res.status(400).send("ERROR: " + err.message);
    }
});




module.exports = profileRouter;