
const dotenv=require('dotenv')
dotenv.config()
const express=require('express');
const cors=require('cors');
const cookieParser=require('cookie-parser')
const userRoutes=require('./routes/user.routes')
const captainRoutes=require('./routes/captain.routes')

const app=express();
//const port=process.env.PORT || 3000;

const connectToDb=require('./db/db');

connectToDb();

app.use(cors({
//  origin: "*", // Allows requests from any origin
  origin: "http://localhost:5173", // Explicit frontend URL
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true // Set this to false if not using cookies
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send('Hello World');
})


app.use('/users',userRoutes)

console.log("entering register captain")
app.use('/captains',captainRoutes)


module.exports=app;