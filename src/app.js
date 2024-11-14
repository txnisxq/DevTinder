//sabse phele express ka instance leke aya hu mai
const express =  require("express");


const app = express(); 

//creating routes
app.use("/user" , 
    //first route handler
    (req,res ,next)=>{
    console.log("Handling the route user 1")
    // res.send("Route handler 1");
    next();
},  
    //second route handler
    (req,res,next)=>{
    console.log("Handling the route user 2")
    // res.send("Route handler 2");
    next();
},  
    //third route handler
    (req,res)=>{
    console.log("Handling the route user 3")
    res.send("Route handler 3");
}
)

//server is listning on PORT 3000=>
app.listen(3000 , ()=>{
    console.log("Server is successfully listning on PORT-3000");
});