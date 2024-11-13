//sabse phele express ka instance leke aya hu mai
const express =  require("express");


const app = express(); 


// yaha per koi bhi request jari hai server per , to server uske reesponse mai  "Hello from the server"  bhej dera hai.
app.use("/user" , (req,res)=>{
    res.send("Hhaahahahaahaha");
});

app.get("/user" , (req,res)=>{
  res.send({firstName:"tanishq" , lastName:"jain"});
});

app.post("/user", (req,res)=>{
    res.send( "data successfully sned to database");
})


//server is listning on PORT 3000=>
app.listen(3000 , ()=>{
    console.log("Server is successfully listning on PORT-3000");
});