const express = require("express");
const requestRouter = express.Router();

//schema export kar liya hai
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const {userAuthentication} = require("../middlewares/auth");

  


requestRouter.post("/request/send/:status/:toUserId" , userAuthentication, async(req,res)=>{
     
    try{
          //"fromUserId" humko milegi hamare "userAuthentication" vale middleware se. Kyuki jab hum userAuthentication vale middleware se authentication karre hai , tab last mai authenticate karne ke baad hum logIn user ka sara data "req.user" me send kar de rahe hai hamari "req" mai .
          //To ab yaha (req) mai hamare loggedIn user ka sara data hai , matlab hamare pass "fromUser"  ka sara data hai.
          const fromUserId = req.user._id;
          

          //or toUserId hume , hamare params se mil jaegi . matlab hum request karte time dalinge na , ki hum kis Id ko request kar raahe hai.
          const toUserId = req.params.toUserId;

          
          //for status => hume "status" bhi params se hi milega , weather it is "interested" or "ignored"=>
          const status = req.params.status;

          //CHECK-1 =>
          //now as we know that this API "/request/send/:status/:toUserId" is only for "interested" or "ignore" .
          //this API is not for "accepted" or "rejected" , status type.
          //means we can only send request or we can only ignore someone's profile. WE can't accept or reject someone's request for this API. So for that we have to put some validations.
          const allowedStatus = ["ignored" , "interested"];
          if(!allowedStatus.includes(status)){
              return res.status(400).json({
                message:"Invalid status type: " + status 
              })
          }

          //CHECK-2 =>
          //checking for "toUserId", checking that "toUserId" exist in DB or not before sending someones Request.
          const toUser = await User.findById(toUserId);
          if(!toUser){
            return res.status(404).json({
                message:"User which i am trying to send the request is not exist!!!. "
            })
          }

          //CHECK-3 =>
          //now after checking the "status" , i have to put one very imp validation that , if A send connection request to B , then we have to ristrict B to send connection request back to A=>
          //yaha neeche tum OR condition ka use seekho ,jab tum findOne karre ho apne database mai.
          const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId , toUserId},
                {fromUserId: toUserId , toUserId:fromUserId}
            ]
          })

          if(existingConnectionRequest){
            return res.status(400).json({
                message:"Connection request already exist. "
            })
          }

          
          //creating new instance in DB
          const connectionRequestData = new ConnectionRequest({fromUserId , toUserId, status});
          await connectionRequestData.save();

          res.status(200).json({
            message: req.user.firstName + " "  + status + " " + toUser.firstName,
            data:connectionRequestData,
            success:true
          })
          

    }
    catch(err){
        res.status(404).send("ERROR!! " + err.message);
    }

})




requestRouter.post("/request/review/:status/:requestId" , userAuthentication , async(req,res)=>{
    
      const loggedInUser = req.user;
      const status = req.params.status;
      const requestId = req.params.requestId;

      //CHECK-1 => status checking
      const allowedStatus = ["accepted" , "rejected"];
      if(!allowedStatus.includes(status)){
        return res.status(404).json({
            success:false,
            message:"Status not allowed"
        })
      }


      //CHECK-2 => A.  db mai jake check karo ki koi requestId exist karti hai ki nahi db mai (check for requestId).
      //           B.  db mai jake check karo ki jisko request bheji hai vo exist karta hai ki nahi. (check for loggegInUser).
      //           C.  db mai jake check karo ki status jo hai vo "interested" hi hona chhaiye , tabhi request acccept hogi. (check for interested).
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser,
        status: "interested"
      });

      if(!connectionRequest){
        return res.status(404).json({
            message:"connection requets not found"
        })
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.status(200).json({
        success:true,
        message:"Connection request " + status + " Successfully "
      })


})

module.exports = requestRouter;