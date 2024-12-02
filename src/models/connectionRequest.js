//this connectionRequest model will define the connection between the two users=>

const mongoose = require("mongoose");

const connectionRequestSchema =  new mongoose.Schema({
    
     fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
     },
     toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
     },
     status:{
        type:String,
        enum:{
            values:["ignored" , "interested" ,"accepted" , "rejected"],
            message:`{VALUE} is incorrect status type`
        },
        required:true
     }

},
{
  timestamps:true,
}
);


//connectionRequestSchema.find({fromUserId:3413452341441})
//whenever we are quering with both paarameters "fromUserId" and to "toUserId" by indexing , these query become very fast , even if we have millions of record in our DB.
connectionRequestSchema.index({fromUserId: 1, toUserId: 1});


//this is not mendatory . U can write your validation where u wrote other validations.
//THIS "pre" is like a middleware . It will be called everytime a connnection request will be saved.
//whenever we will call a ".save()" method , before that this "pre" will be automatically called.
//remember one thing that always use "function()" here instead of an "arrow(=>)" function.
connectionRequestSchema.pre("save" , function(next) {
     const ConnectionRequest = this;
     //i am using this pre method here because for the validation , that forUserId and toUserId should not be same.
     if(ConnectionRequest.fromUserId.equals(ConnectionRequest.toUserId)){
        throw new Error("U cannot send request to yourself. ");
     }
     //in above condition i cannot compare "fromUserId" and "toUserId" directly, because they are not properly string type , they object type. Look at both schema (type: mongoose.Schema.Types.ObjectId).
      next();
})


module.exports = mongoose.model("ConnectionRequest" , connectionRequestSchema);