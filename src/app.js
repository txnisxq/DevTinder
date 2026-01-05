//sabse phele express ka instance leke aya hu mai
const express =  require("express");
const app = express(); 


const cors = require("cors");





//i have to include this middleware because this middleware is helping me to convert the json request(which we are send this postman) into javascrict object , so that we can use that data which is sending through request.
//basically we are using this middleware to parse the data from request body=> 
app.use(express.json());



//cookie-parser middleware (npm i cookie-parser): whenever any request will come , my cookie will be parsed and i can access those cookies.
//basically when the request will come i can read the cookies because of that parser.
const cookieParser = require("cookie-parser");
app.use(cookieParser());


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));




const authRouter = require("./routes/authRoute");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");
const userRouter = require("./routes/userRouter");


app.use("/" , authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/" , userRouter);


//connecting  database
const database = require("./config/database");
const { userAuth } = require("./middlewares/auth");
database()
  .then(()=>{
    console.log("DB connect Successfully");
    app.listen(3000 , ()=>{
        console.log("server is successfully listning on port 3000")
    });
  })
  .catch((err)=>{
    console.error("DB connection ISSUE!!!");
    console.log(err);
  })






//gIAxtWYB5507FAfN