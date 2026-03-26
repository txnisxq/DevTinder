const express = require('express');
const paymentRouter = express.Router();
const {userAuthentication} = require("../middlewares/auth");
const razorpayInstance  = require("../utils/razorpay");
const User = require("../models/user");
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants");
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils');


paymentRouter.post("/payment/create" , userAuthentication, async(req,res)=>{
     try{
           
        const {membershipType} = req.body;
        // console.log("Membership Type:", membershipType);
        // console.log(membershipType);
        const {firstName , lastName , emailId} =  req.user;

           
           //this will create an order for us and it will return us an order object which will contain the order id and other details which we can use to make the payment.
           //basically this order id will be used to make the payment and we can also use this order id to verify the payment after the payment is done.
           //it returns us a promise so we have to use async await to get the order object.
           //this razorpay instance  is initialized with the key id and secret key which we have set in the environment variables and we are using that instance to create an order.
           const order = await razorpayInstance.orders.create({
                amount: membershipAmount[membershipType] * 100,   //amount should be in paise so we have to multiply it by 100
                currency: "INR",
                receipt: "receipt#1",
                notes:{
                    firstName,
                    lastName,
                    membershipType: membershipType,
                },

            });


            //we have to save this information in our database because after the payment is done we have to verify the payment and for that we need the order id and other details which we will get from this order object.
            //creating a new payment document(or instance) and saving it in the database.
            const payment = new Payment({
                userId: req.user._id,
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                receipt: order.receipt,
                notes: order.notes,
                status: order.status,
            });
           

            const savedPayment = await payment.save();

            //we have to return the response(order) details to frontend
            res.status(200).json({...savedPayment._doc , keyId:"rzp_test_SUgz0fkKARaL87" });
            console.log("Payment created successfully");
            console.log("KEY:", process.env.RAZORPAY_KEY_ID);
           
     }
     catch(err){
           console.log("FULL ERROR 👉", err);
           console.log("ERROR MESSAGE 👉", err?.message);
            console.log("ERROR RESPONSE 👉", err?.response?.data);

           res.status(500).send({
            error: err?.message,
           fullError: err
  });
}
})



paymentRouter.post("/payment/webhook" ,express.raw({ type: "application/json" }), async(req,res)=>{
    
    try{
        
        //by this line i can get my webhook signature header which is sent by razorpay to my webhook url and this signature is used to verify the authenticity of the webhook request and to ensure that the request is coming from razorpay and not from any other source.
        const webhookSignature = req.headers["x-razorpay-signature"];
        console.log("Webhook Signature:", webhookSignature);


        //this line actually validate webhook signature which is sent by razorpay to our webhook url and it will return true if the signature is valid and false if the signature is invalid.
        const isWebhookValid = validateWebhookSignature(req.body, webhookSignature, process.env.RAZORPAY_WEBHOOK_SECRET);
        if(!isWebhookValid){
            return res.status(400).send("Invalid webhook signature");
        } 

        //update my payment status in DB
        const paymentDetails = req.body.payload.payment.entity;  //ye line mujhe payment details dega jo ki razorpay mujhe bhej raha hai jab bhi koi payment hoti hai to razorpay mujhe uski details bhejta hai aur wo details mujhe req.body.payload.payment.entity ke andar milti hai.
 
        const payment = await Payment.findOne({orderId: paymentDetails.order_id});
        payment.status = paymentDetails.status;  //ye line mujhe payment status update karne me help karega jo ki razorpay mujhe bhej raha hai jab bhi koi payment hoti hai to razorpay mujhe uski details bhejta hai aur wo details mujhe req.body.payload.payment.entity ke andar milti hai.
        await payment.save();

       //updating user ingo in DB about his premium membership
        const user = await User.findOne({id: payment.userId});
        user.isPremium = true;   //ye line mujhe user ko premium update karne me help karega.
        user.membershipType = payment.notes.membershipType;  //ye line mujhe user ke membership type ko update karne me help karega jo ki razorpay mujhe bhej raha hai jab bhi koi payment hoti hai to razorpay mujhe uski details bhejta hai aur wo details mujhe req.body.payload.payment.entity ke andar milti hai.
        await user.save();


        //updating the user as premium
        // if(req.body.event === "payment.captured"){
            
        // }
        // if(req.body.event === "payment.failed"){

        // }

        return res.status(200).send("Webhook received successfully");

    }
    catch(err){
        console.log("Error in webhook:", err);
    }
})
     //



module.exports = paymentRouter;