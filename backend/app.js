const dotenv=require('dotenv')
dotenv.config()
const express=require('express');
const cors=require('cors');
const cookieParser=require('cookie-parser')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const userRoutes=require('./routes/user.routes')
const captainRoutes=require('./routes/captain.routes')
const mapsRoutes=require('./routes/maps.routes')
const rideRoutes=require('./routes/ride.routes')
const User = require('./models/user.model');

const app=express();
//const port=process.env.PORT || 3000;

const connectToDb=require('./db/db');

connectToDb();

app.use(cors({
//  origin: "*", // Allows requests from any origin
origin: [
  "http://localhost:5173",
  // "https://29dv0wmq-5173.inc1.devtunnels.ms",
  "https://travelx-five.vercel.app"
], // Explicit frontend URL
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true // Set this to false if not using cookies
}));
 
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


// app.use(
//   session({
//     secret: 'process.env.SESSION_SECRET', // Replace with a strong secret
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// Initialize Passport
// app.use(passport.initialize());
// app.use(passport.session());

// Passport Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://travelx-five.vercel.app/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {

//  MongoDB se find karo koi user jiska googleId field equal ho profile.id ke.
// Agar mila → wohi user hai → uspe login successful
// Nahi mila → shayad naye user hain → email se check karo → nahi to naya bana lo.
//profile.id → Google ke taraf se diya gaya unique ID hota hai (har Google account ke liye unique hota hai).
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            user.googleId = profile.id;
            await user.save();
          } else {
            user = await User.create({
              googleId: profile.id,
              fullname: {
                firstname: profile.name.givenName || "Unknown",
                lastname: profile.name.familyName || "Unknown",
              },
              email: profile.emails[0].value,
            });
          }
        }

        done(null, user);
      } catch (error) {
        console.error('Error in GoogleStrategy:', error);
        done(error, null);
      }
    }
  )
);

// Serialize and deserialize user
// passport.serializeUser((user, done) => done(null, user.id));
// async function findUserById(id) {
//   try {
//     const user = await User.findById(id); // Use the User model to find the user by ID
//     return user;
//   } catch (error) {
//     console.error('Error in findUserById:', error);
//     throw error;
//   }
// }
// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await findUserById(id); // Replace with your DB logic
//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// });

// Google OAuth Routes
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login',session: false  }),
  async (req, res) => {
    try {
      // Generate a JWT token for the authenticated user
      const token = req.user.generateAuthToken(); // Assuming `generateAuthToken` is defined in your User model
      console.log('Generated Token:', token); // Debug log

      // Set the token as a cookie
      res.cookie('token', token, {
        secure: true,
       // secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'None', // Required for cross-site cookies
      });
        
      console.log('Cookie set successfully');
      // Redirect to the frontend home page
      res.redirect('https://travelx-five.vercel.app/home');
    } catch (error) {
      console.error('Error in Google OAuth callback:', error);
      res.redirect('/login');
    }
  }
);

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/login');
  });
});







app.get('/',(req,res)=>{
    res.send('Hello World');
})


app.use('/users',userRoutes)

console.log("entering register captain")
app.use('/captains',captainRoutes)
app.use('/maps',mapsRoutes)
app.use('/rides',rideRoutes)


module.exports=app;
