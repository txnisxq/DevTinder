const jwt = require("jsonwebtoken");
const User = require("../models/user");
//auth is for every other request.

exports.userAuthentication = async(req, res, next)=>{

    try{
        //Read the token from the req cookies
        const {token} = req.cookies;
        if(!token){
            throw new Error("token not found");
        }
        
        const validateToken = await jwt.verify(token, "Tanishq@123");

        const {_id} = validateToken;

        const user = await User.findById({_id});
        if(!user){
            throw new Error("user not exist");
        }

        req.user = user;
        next();
    }
    catch(err){
         res.status(400).send("ERROR" + err.message);
    }
    
};

