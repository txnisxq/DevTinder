const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        
    },
    emailId:{
        type:String,
        required:true,    //required means it is mendatory to fill this field
        unique:true,      //unique means that if u signup with same emailid that aready exits, then it won't let u signup;
        lowercase:true,   //it convert the uppercase if exist in user emailId to lowercase.
        trim:true,        //if user type its emailId with spaces between , it repair it.
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number, 
    },
    gender:{
        type:String,
        enum:["male" , "female", "others"],
    },
    photoUrl:{
        type:String,
        default:"https://img.freepik.com/free-vector/blank-user-circles_78370-4336.jpg",
    },
    about:{
        type:String,
        default:"This is default info about user",  // this about section can take default value in case if user dont put anything inside it by their own.
    },
    skills:{
        type:[String],  //hear i am writing string insside square brackets because , we can write multiple skills , so this square bracket is an array which can take multiple string values.
    }
},
{
    timestamps:true,
}

);

module.exports = mongoose.model("User" , userSchema);