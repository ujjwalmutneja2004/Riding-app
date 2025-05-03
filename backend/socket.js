const { Server } = require("socket.io");
///jab bhi koi captain ya user connect unki socket id database me store
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");


let io;

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin:[
        "https://29dv0wmq-5173.inc1.devtunnels.ms",
        "http://localhost:5173", // Replace with your frontend URL
        "https://travelx-five.vercel.app"
      ],
      methods: ["GET", "POST"],
      credentials: true   
    },
  });

  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);
  
    socket.on('join', async (data) => {
      const { userId, userType } = data;
     
  
      if (userType === "user") {
        await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
        console.log(`User ${userId} joined with socket ${socket.id} and userType ${userType}`);

        
      } else if (userType === "captain") {
        await captainModel.findByIdAndUpdate(userId, { socketId: socket.id , status: 'active'});
        console.log(`Captain ${userId} joined with socket ${socket.id} and userType ${userType}`);
      }
    });

    //every 10 seconds location of captain is updating in mongodb connections with captain home
    socket.on('update-location-captain',async(data)=>{
      const { userId,  location } = data;

      if(!location || !location.lat || !location.lng){
        console.error("Invalid location data:", location);
        return; 
      }
      console.log("updated location",location)
      console.log("captain id for up",userId)
      const updatedCaptain = await captainModel.findByIdAndUpdate(
        userId,
        {
          $set: {
            location: {
              lat: location.lat,
              lng: location.lng
            }
          }
        },
        {
          new: true,
          runValidators: true
        }
      );
      
      // console.log("✅ Updated Captain Location:", updatedCaptain);

          
    })

  
    socket.on("disconnect", async () => {
      console.log(`Client disconnected: ${socket.id}`);
  
      // Optionally clear socketId from DB
      await userModel.updateOne({ socketId: socket.id }, { $unset: { socketId: "" } });
      await captainModel.updateOne({ socketId: socket.id }, { $unset: { socketId: "" } , $set: { status: 'inactive' }});
    });
  });
} 


function sendMessageToSocketId(socketId, messageObject) {
  console.log("Sending message to socket ID of all captains in radius :", messageObject);
  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.error("Socket.io is not initialized.");
  }
}

module.exports = {
  initializeSocket,
  sendMessageToSocketId,
};





// Socket.IO server is now listening.it is written where i have server.js so when i start backend server it runs
// But it’s just waiting — like a receptionist ready for guests.
//✅ Step 2: Frontend connects to Socket.IO
// import { io } from "socket.io-client";
// const socket = io("http://localhost:4000", {
//   withCredentials: true,
// });
// This is like a guest entering the office.

// The backend triggers this callback:
// io.on("connection", (socket) => {
//   console.log("New client connected", socket.id);
// });
///Frontend emits "join" event

// socket.emit("join", {
//   userId: "123",
//   userType: "user",
// });


//backend now send messages
// Whenever backend wants to send real-time message (example: booking assigned):
// const { sendMessageToSocket } = require("./socket");

// sendMessageToSocket("captainSocketId123", "booking-assigned", {
//   rideId: "RID123",
//   pickup: "A",
//   drop: "B",
// });
// This will instantly be received on frontend:
// socket.on("booking-assigned", (data) => {
//   console.log("Ride assigned!", data);
// });



// aha connection aur connect same event ke do ends hain:

// connection backend ka listener hota hai

// connect frontend ka listener hota hai

// ❓ Then kya join bhi fix hota hai?
// Nahi. join, message, chat, typing, customEventName — sab custom events hote hain jo tum define karte ho.
