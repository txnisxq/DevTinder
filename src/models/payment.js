const mongoose = require("mongoose");

const User = require("./user");

const paymentSchema  = new mongoose.Schema({
      
    userId:{
            type:mongoose.Schema.Types.ObjectId,    //it is very imp to write this type as objectId because we have to refer to the user collection and we have to get the user id from there and we have to save that user id in this userId field so that we can know which user has made this payment.
            ref:"User",
            required:true,
      },
    
     orderId:{
            type:String,
            required:true,
      },
      paymentId:{                    //payment is not mendatory because we can create order without payment , after order is created then we will get the payment id when the payment is done.
            type:String,
      },
      amount:{
            type:Number,
            required:true,  
      },
      currency:{
            type:String,
            required:true,
      },
      receipt:{
            type:String,
            required:true,
      },
      notes:{
            firstName:{
                  type:String,
                  
            },
            lastName:{
                  type:String,
                 
            },
            membershipType:{
                  type:String,
                
            },
      },
      status:{
            type:String,
            // enum:["created", "paid", "failed"],
            default:"created",
      },
}, 
{
  timestamps:true,
})


module.exports = mongoose.model("Payment" , paymentSchema);