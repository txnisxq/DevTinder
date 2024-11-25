const validator = require("validator");

exports.validateSignUpData = (req)=>{
     
    const {firstName,  lastName, emailId , password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Either firstName or lastName is not present: ");
    }

    else if(firstName.length<4 || firstName.length>30){
        throw new Error("length should be 4-30 words: ");
    }

    else if(!validator.isEmail(emailId)){
        throw new Error("email is not valid: ");
    }

    else if(!validator.isStrongPassword(password)){
        throw new Error("password is not valid: ");
    }
};


exports.validateLogInData = (req)=>{
    
    const {emailId , password} = req.body;

    if(!emailId || !password){
        throw new Error("type your password or emailId: ");
    }

    else if(!validator.isEmail(emailId)){
        throw new Error("email is not valid: ");
    }
}

