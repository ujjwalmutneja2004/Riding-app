
const dotenv=require('dotenv')
dotenv.config()
const express=require('express');
const cors=require('cors');
const cookieParser=require('cookie-parser')
const userRoutes=require('./routes/user.routes')
const captainRoutes=require('./routes/captain.routes')
const mapsRoutes=require('./routes/maps.routes')
const rideRoutes=require('./routes/ride.routes')

const app=express();
//const port=process.env.PORT || 3000;

const connectToDb=require('./db/db');

connectToDb();

app.use(cors({
//  origin: "*", // Allows requests from any origin
origin: [
  "http://localhost:5173",
  "https://29dv0wmq-5173.inc1.devtunnels.ms",
  "https://travelx-five.vercel.app"
], // Explicit frontend URL
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
app.use('/maps',mapsRoutes)
app.use('/rides',rideRoutes)


module.exports=app;
