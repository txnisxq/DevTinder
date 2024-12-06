const express = require("express");
const userRouter = express.Router();

const {userAuthentication} = require("../middlewares/auth");

const User  = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

//get all the pending connection requests for the loggedIn user
userRouter.get("/user/requests" , userAuthentication, async(req,res)=>{
    

    try{
        const loggedInUser = req.user;
        
        // (.find) give me an "array" of connection request.
        const allConnectionRequest = await ConnectionRequest.find({toUserId:loggedInUser._id , status: "interested"}).populate("fromUserId" , ["firstName" , "lastName" , "photoUrl" , "skills" , "age", "gender"]);
        

        res.status(200).json({
            data: allConnectionRequest
        })

    }
    catch(err){
       res.status(404).json({
        message:"ERROR in getting requests Info!!! "
       })
    }
    
})




//get all the connections i have (accepted connection)
userRouter.get("/user/connections" , userAuthentication, async(req,res)=>{
   
     try{
         const loggedInUser = req.user;

         const allConnections = await ConnectionRequest.find({
            $or:[
                {toUserId: loggedInUser._id , status: "accepted"},
                {fromUserId: loggedInUser._id , status: "accepted"}
            ]
         }).populate("fromUserId" , ["firstName" , "lastName" , "photoUrl" ,"gender"]).populate("toUserId" , ["firstName" , "lastName" , "photoUrl" ,"gender"]);

         


         const sufficientData =  allConnections.map((row) => {
            if( row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
         });

      
         res.status(200).json({
            data: sufficientData,
         })
          
     }
     catch(err){
        res.status(404).json({
            message:"Error in getting connections: " + err.message,
            success:false
        }) 

     }
}); 




//creating FEED api=>
userRouter.get("/feed" , userAuthentication, async(req,res)=>{
     
    try{
        const loggedInUser = req.user;


        const page = parseInt(req.query.page) || 1;
        
        let limit = parseInt(req.query.limit) || 10;
        limit = (limit>20) ? 20 : limit;

        const skip = (page-1)*limit;



        const allConnectionRequest = await ConnectionRequest.find({
            $or:[
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId  toUserId");

        

        //set mai unique ids ko push kar dunga (fromUserId or toUserId jo jo unique hai unko push kar dunga )
        const hideUserFromfeed = new Set();
        allConnectionRequest.map((x)=>{
            hideUserFromfeed.add(x.fromUserId.toString());
            hideUserFromfeed.add(x.toUserId.toString());
        });
        
       

        // this is a function to create new Array from any iterables like "array" , "objects" and "string".
        //and in this case we are converting "Set" to an "Array."
        const creatingArrayOfIds = Array.from(hideUserFromfeed);
         
        //here i write "$and" which is a "and-query" , and inside "and-query"  both condition i wrote should be satisfied.
        //here the first condition is finding all the people whoes "_id" is "not" present in "creatingArrayOfIds" ARRAY. and also the second condition is avoiding logedInUser to show in loggedInUser feed.
        // "$nin" is "not-in" query.
        //"$ne" is "not-equals" query.
        const users = await User.find({
         
        $and:[
               {_id: {$nin: creatingArrayOfIds}},
               {_id: {$ne: loggedInUser._id}}
         ]
         
        }).select("firstName lastName gender age skills photoUrl")
          .skip(skip)
          .limit(limit);

        res.status(200).json({
            data: users,
            success:true,
            message:"balle balle shaba shaba"
        });
         
    }
    catch(err){
        res.status(404).json({
            message:"Error in getting FEED's !!! "
        })
    }
});


module.exports = userRouter;