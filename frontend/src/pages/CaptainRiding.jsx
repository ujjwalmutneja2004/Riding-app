// import React ,{useRef,useState}from 'react'
// import { Link , useNavigate,useLocation} from 'react-router-dom';
// import  CaptainLiveTracking  from '../components/CaptainLiveTracking';
// import { useContext } from 'react';
// import { SocketContext } from '../context/SocketContext';

// import FinishRide from '../components/FinishRide';
// import { useGSAP } from '@gsap/react';
// import gsap from 'gsap';



//     // const handleLogout = async () => {
//     //     try {
//     //       const response = await fetch("http://localhost:4000/captains/logout", {
//     //         method: "GET",
//     //         credentials: "include", // Ensures cookies are sent with the request
//     //       });
    
//     //       if (response.ok) {
//     //         navigate("/captain-home"); // Redirecting after logout
//     //       } else {
//     //         console.error("Logout failed");
//     //       }
//     //     } catch (error) {
//     //       console.error("Error during logout:", error);
//     //     }
//     //   };



// const CaptainRiding = () => {
//   const [finishRidePanel,setFinishRidePanel] = useState(false);
//   const finishRidePanelRef = useRef(null);
//     const location = useLocation();
//     const rideData=location.state?.ride
//     const navigate = useNavigate();
    
//     useGSAP(
//       function () {
//         if (finishRidePanel) {
//           gsap.to(finishRidePanelRef.current, {
//             transform: "translateY(0)",
//           });
//         } else {
//           gsap.to(finishRidePanelRef.current, {
//             transform: "translateY(100%)",
//           });
//         }
//       },
//       [finishRidePanel]
//     );
  




    
//   const handleLogout = async () => {
//     try {
//       const response = await fetch('/logout', {
//         method: 'GET',
//         credentials: 'include', // Important for session-based authentication
//       });

//       if (response.ok) {
//         // Clear any authentication tokens if stored
//         localStorage.removeItem('token');

//         console.log('Captain logout worked');

//         // Redirect to login page
//         navigate('/captain-login'); 
//       } else {
//         console.error('Logout failed');
//       }
//     } catch (error) {
//       console.error('Error logging out:', error);
//     }
//   };





//   return (
//     <div className="h-screen">

//       <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
         
//       }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>

//       {/* <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
//         <img
//           className="w-16 "
//           src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png"
//           alt=""
//         />
//         <Link
//           to="/captain-home"
//           className=" h-10 w-10 bg-white flex items-center justify-center rounded-full"
//         >
//           <i className="text-lg font-medium ri-logout-box-r-line"></i>
//         </Link>
//       </div> */}
//        <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
//       <img
//         className="w-16"
//         src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png"
//         alt="Uber Logo"
//       />
//       <button
//         onClick={handleLogout}
//         className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
//       >
//         <i className="text-lg font-medium ri-logout-box-r-line"></i>
//       </button>
//     </div>






//       <div className="h-4/5 ">
//         {/* <img
//           className="h-full w-full object-cover"
//           src="https://user-images.githubusercontent.com/6416095/52931260-c6bb5e80-3371-11e9-9d46-83f7d1389d18.gif"
//           alt="map"
//         /> */}
//          {/* <CaptainLiveTracking 
//          destination={{ lat: ride?.destLat, lng: ride?.destLng   }} 
//          pickup={{ lat: ride?.pickLat, lng: ride?.pickLong }}
//          /> */}
//       </div>

//       <div className="h-1/5 p-6 flex items-center justify-between bg-yellow-400 "
//       onClick={()=> setFinishRidePanel(true)}
//       >
//         <h4 className='text-xl font-semibold'>4 KM AWAY</h4>
//         <button className='bg-green-600 text-white font-semibold p-3 px-10 rounded-lg'>Complete Ride</button>
//       </div>

//       <div
//         ref={finishRidePanelRef}
//         className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
//       >
//         <FinishRide 
//         ride={rideData}
//         setFinishRidePanel={setFinishRidePanel} 
//         />
//       </div>

      

      
//     </div>
//   );
// }

// export default CaptainRiding


// import React, { useRef, useState,useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import CaptainLiveTracking from "../components/LiveTracking";
// import FinishRide from "../components/FinishRide";
// import { useGSAP } from "@gsap/react";
// import gsap from "gsap";
// import axios from 'axios'

// const CaptainRiding = () => {
//   const [finishRidePanel, setFinishRidePanel] = useState(false);
//   const finishRidePanelRef = useRef(null);
//   const location = useLocation();
//   const ride = location.state?.ride; // Access the ride object from state
//   const navigate = useNavigate();
//   const [latP , setLatP] =useState(ride?.pickupLat); 
//   const [latD , setLatD] =useState(ride?.destLat); 
//   const [lngP , setLngP] =useState(ride?.pickupLng); 
//   const [lngD , setLngD] =useState(ride?.destLng); 



  
//   const [distance, setDistance] = useState(null);
  
//   // Function to calculate distance between captain's current location and destination
//   // Function to calculate distance between captain's current location and destination
//   const calculateDistance = async () => {
//     console.log('📍 calculateDistance() triggered');
  
//     if (!navigator.geolocation) {
//       console.error('❌ Geolocation is not supported by this browser.');
//       return;
//     }
  
//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const currentLocation = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         };
  
//         const originLat = currentLocation.lat;
//         const originLng = currentLocation.lng;
//         const destLat = Number(ride?.destLat);
//         const destLng = Number(ride?.destLng);
  
//         // Check if coordinates are valid
//         if (!originLat || !originLng || !destLat || !destLng) {
//           console.error('❌ Missing coordinates:', { originLat, originLng, destLat, destLng });
//           return;
//         }
  
//         try {
//           const token = localStorage.getItem("token");
  
//           const response = await axios.get(
//             `${import.meta.env.VITE_BASE_URL}/maps/getdistby`,
//             {
//               params: { originLat, originLng, destLat, destLng },
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );
  
//           console.log("✅ Distance response:", response.data);
  
//           if (response.data?.distance) {
//             setDistance(response.data.distance);
//           }
//         } catch (error) {
//           console.error("🔥 Error while calling distance API:", {
//             message: error.message,
//             status: error.response?.status,
//             data: error.response?.data,
//           });
  
//           console.log("🔍 Current Location:", originLat, originLng);
//           console.log("🎯 Destination:", destLat, destLng);
//         }
//       },
//       (error) => {
//         console.error('❌ Error getting current location:', error);
  
//         // Optional: show error message to user
//         switch (error.code) {
//           case 1:
//             alert('Permission denied for location access.');
//             break;
//           case 2:
//             alert('Location unavailable. Try again later.');
//             break;
//           case 3:
//             alert('Location request timed out. Try moving to an open area or check your internet.');
//             break;
//           default:
//             alert('Unknown error occurred while fetching location.');
//         }
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 30000,  // 30 seconds
//         maximumAge: 0,
//       }
//     );
//   };
  



//   useEffect(() => {
//     if (
//       ride?.pickupLat &&
//       ride?.pickupLng &&
//       ride?.destLat &&
//       ride?.destLng
//     ) {
//       setLatP(ride.pickupLat);
//       setLngP(ride.pickupLng);
//       setLatD(ride.destLat);
//       setLngD(ride.destLng);
//     }
//   }, [ride]);

//   const areCoordsValid = [latP, latD, lngP, lngD].every(
//     (val) => val !== undefined && val !== null && !isNaN(parseFloat(val))
//   );


//   console.log('Ride Object:', ride);
//   console.log('Pickup Coordinates:', { lat: ride?.pickupLat, lng: ride?.pickupLng });
//   console.log('Destination Coordinates:', { lat: ride?.destLat, lng: ride?.destLng });
  


//   useGSAP(
//     function () {
//       if (finishRidePanel) {
//         gsap.to(finishRidePanelRef.current, {
//           transform: "translateY(0)",
//         });
//       } else {
//         gsap.to(finishRidePanelRef.current, {
//           transform: "translateY(100%)",
//         });
//       }
//     },
//     [finishRidePanel]
//   );

//   const handleLogout = async () => {
//     try {
//       const response = await fetch("/logout", {
//         method: "GET",
//         credentials: "include", // Important for session-based authentication
//       });

//       if (response.ok) {
//         localStorage.removeItem("token");
//         console.log("Captain logout worked");
//         navigate("/captain-login");
//       } else {
//         console.error("Logout failed");
//       }
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };

//   return (
//     <div className="h-screen">
//       <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
//         <img
//           className="w-16"
//           src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png"
//           alt="Uber Logo"
//         />
//         <button
//           onClick={handleLogout}
//           className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
//         >
//           <i className="text-lg font-medium ri-logout-box-r-line"></i>
//         </button>
//       </div>
        

//      {areCoordsValid && <div className="h-4/5">

//       <CaptainLiveTracking
//     destination={{
//         lat: parseFloat(ride?.destLat),
//         lng: parseFloat(ride?.destLng),
//     }}
//     pickup={{
//         lat: parseFloat(ride?.pickupLat),
//         lng: parseFloat(ride?.pickupLng),
//     }}
// />
// {/*    <img className='h-full w-full object-fit' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" /> */}


//          {/* <img
//           className="h-full w-full object-cover"
//           src="https://user-images.githubusercontent.com/6416095/52931260-c6bb5e80-3371-11e9-9d46-83f7d1389d18.gif"
//           alt="map"
//         /> */}
//       </div>}




//       <div
//         className="h-1/5 p-6 flex items-center justify-between bg-yellow-400"
//         onClick={() => setFinishRidePanel(true)}
//       >





//          <h5 className="text-lg font-semiibold mr-2" >{distance ? `${distance}` : 'Calculating...'}</h5>
//          <button
//          onClick={calculateDistance}
//           className="px-4 py-2 mt-4 text-sm bg-blue-500 text-black font-medium rounded-full shadow-md hover:bg-yellow-600 transition duration-300 ml-auto"
//            >
//             Get Distance
//             </button>
//         <button className="bg-green-600 text-white font-semibold p-3 px-10 rounded-lg">
//           Complete Ride
//         </button>

   
//       </div>



//       <div
//         ref={finishRidePanelRef}
//         className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
//       >
//         {/* Pass ride data to FinishRide */}
//         <FinishRide ride={ride} setFinishRidePanel={setFinishRidePanel} />
//       </div>
//     </div>
//   );
// };

// export default CaptainRiding;

import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CaptainLiveTracking from "../components/LiveTracking";
import FinishRide from "../components/FinishRide";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);
  const location = useLocation();
  const ride = location.state?.ride;
  const navigate = useNavigate();
const [captainLocation, setCaptainLocation] = useState(null);
  const [distance, setDistance] = useState(null);

    //added
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    socket.on("update-location-captain", (data) => {
      console.log("📍 Location update received:", data);
      setCaptainLocation(data.location);
    });

    return () => {
      socket.off("update-location-captain");
    };
  }, [socket]);

    //added
    


//added
  // Fetch location every 10 seconds
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude, accuracy } = position.coords;
  //         const current = {
  //           lat: latitude,
  //           lng: longitude,
  //           accuracy: `${accuracy} meters`,
  //         };
  //         console.log("\nLocation fetched:", JSON.stringify(current, null, 2));
  //         setCaptainLocation({ lat: latitude, lng: longitude });
  //       },
  //       (err) => {
  //         console.error("❌ Error fetching location:", err);
  //       },
  //       {
  //         enableHighAccuracy: true,
  //         timeout: 10000,
  //         maximumAge: 0,
  //       }
  //     );
  //   }, 10000);

  //   return () => clearInterval(interval);
  // }, []);


    //added
  useEffect(() => {
    if (!ride) navigate("/"); // or any default route
  }, [ride]);
    //added

  const calculateDistance = async () => {
    if (!captainLocation || !ride?.destLat || !ride?.destLng) {
      alert("Missing location or destination coordinates");
      return;
    }
      

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/getdistby`,
        {
          params: {
            originLat: captainLocation.lat,
            originLng: captainLocation.lng,
            destLat: Number(ride.destLat),
            destLng: Number(ride.destLng),
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.distance) {
        setDistance(response.data.distance);
      }
    } catch (error) {
      console.error("Distance API error:", error);
    }
  };

  useGSAP(
    () => {
      gsap.to(finishRidePanelRef.current, {
        transform: finishRidePanel ? "translateY(0)" : "translateY(100%)",
      });
    },
    [finishRidePanel]
  );

  const handleLogout = async () => {
    try {
      const response = await fetch("/logout", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("token");
        navigate("/captain-login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const coordsValid = [ride?.pickupLat, ride?.pickupLng, ride?.destLat, ride?.destLng].every(
    (val) => val !== undefined && val !== null && !isNaN(parseFloat(val))
  );

  return (
    <div className="h-screen">
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
        <img
          className="w-16"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png"
          alt="Uber Logo"
        />
        <button
          onClick={handleLogout}
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </button>
      </div>

      {coordsValid && (
        <div className="h-[78vh]">
          <CaptainLiveTracking
            destination={{ lat: parseFloat(ride?.destLat), lng: parseFloat(ride?.destLng) }}
            pickup={{ lat: parseFloat(ride?.pickupLat), lng: parseFloat(ride?.pickupLng) }}
            captainLocation={captainLocation}
          />
        </div>
      )}

      <div
        className="h-[22vh] p-6 flex items-center justify-between bg-yellow-400 gap-4"
        onClick={() => setFinishRidePanel(true)}
      >
        <h5 className="text-lg font-semibold">
          {distance ? `${distance}` : "Calculating..."}
        </h5>
        <button
          onClick={calculateDistance}
          className="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-full shadow hover:bg-blue-700 transition"
        >
          Get Distance
        </button>
        <button className="bg-green-600 text-white font-semibold p-3 px-10 rounded-lg">
          Complete Ride
        </button>
      </div>

      <div
        ref={finishRidePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <FinishRide ride={ride} setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  );
};

export default CaptainRiding;

