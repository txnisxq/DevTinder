//sabse phele express ka instance leke aya hu mai
const express =  require("express");


const app = express(); 


// yaha per koi bhi request jari hai server per , to server uske reesponse mai  "Hello from the server"  bhej dera hai.
app.use("/test" , (req,res)=>{
    res.send("Hello from the server");
});


app.use("/hello" , (req,res)=>{
    res.send("Hello from the server");
});




//server is listning on PORT 3000=>
app.listen(3000 , ()=>{
    console.log("Server is successfully listning on PORT-3000");
});