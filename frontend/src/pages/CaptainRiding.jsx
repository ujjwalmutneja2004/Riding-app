
// import React, { useRef, useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import CaptainLiveTracking from "../components/LiveTracking";
// import FinishRide from "../components/FinishRide";
// import { useGSAP } from "@gsap/react";
// import gsap from "gsap";
// import axios from "axios";

// const CaptainRiding = () => {
//   const [finishRidePanel, setFinishRidePanel] = useState(false);
//   const finishRidePanelRef = useRef(null);
//   const location = useLocation();
//   const ride = location.state?.ride;
//   const navigate = useNavigate();
// const [captainLocation, setCaptainLocation] = useState(null);
//   const [distance, setDistance] = useState(null);

//     //added
//   const { socket } = useContext(SocketContext);

//   useEffect(() => {
//     socket.on("update-location-captain", (data) => {
//       console.log("📍 Location update received:", data);
//       setCaptainLocation(data.location);
//     });

//     return () => {
//       socket.off("update-location-captain");
//     };
//   }, [socket]);

//     //added
    


// //added
//   // Fetch location every 10 seconds
//   // useEffect(() => {
//   //   const interval = setInterval(() => {
//   //     navigator.geolocation.getCurrentPosition(
//   //       (position) => {
//   //         const { latitude, longitude, accuracy } = position.coords;
//   //         const current = {
//   //           lat: latitude,
//   //           lng: longitude,
//   //           accuracy: `${accuracy} meters`,
//   //         };
//   //         console.log("\nLocation fetched:", JSON.stringify(current, null, 2));
//   //         setCaptainLocation({ lat: latitude, lng: longitude });
//   //       },
//   //       (err) => {
//   //         console.error("❌ Error fetching location:", err);
//   //       },
//   //       {
//   //         enableHighAccuracy: true,
//   //         timeout: 10000,
//   //         maximumAge: 0,
//   //       }
//   //     );
//   //   }, 10000);

//   //   return () => clearInterval(interval);
//   // }, []);


//     //added
//   useEffect(() => {
//     if (!ride) navigate("/"); // or any default route
//   }, [ride]);
//     //added

//   const calculateDistance = async () => {
//     if (!captainLocation || !ride?.destLat || !ride?.destLng) {
//       alert("Missing location or destination coordinates");
//       return;
//     }
      

//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         `${import.meta.env.VITE_BASE_URL}/maps/getdistby`,
//         {
//           params: {
//             originLat: captainLocation.lat,
//             originLng: captainLocation.lng,
//             destLat: Number(ride.destLat),
//             destLng: Number(ride.destLng),
//           },
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data?.distance) {
//         setDistance(response.data.distance);
//       }
//     } catch (error) {
//       console.error("Distance API error:", error);
//     }
//   };

//   useGSAP(
//     () => {
//       gsap.to(finishRidePanelRef.current, {
//         transform: finishRidePanel ? "translateY(0)" : "translateY(100%)",
//       });
//     },
//     [finishRidePanel]
//   );

//   const handleLogout = async () => {
//     try {
//       const response = await fetch("/logout", {
//         method: "GET",
//         credentials: "include",
//       });

//       if (response.ok) {
//         localStorage.removeItem("token");
//         navigate("/captain-login");
//       } else {
//         console.error("Logout failed");
//       }
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };

//   const coordsValid = [ride?.pickupLat, ride?.pickupLng, ride?.destLat, ride?.destLng].every(
//     (val) => val !== undefined && val !== null && !isNaN(parseFloat(val))
//   );

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

//       {coordsValid && (
//         <div className="h-[78vh]">
//           <CaptainLiveTracking
//             destination={{ lat: parseFloat(ride?.destLat), lng: parseFloat(ride?.destLng) }}
//             pickup={{ lat: parseFloat(ride?.pickupLat), lng: parseFloat(ride?.pickupLng) }}
//             captainLocation={captainLocation}
//           />
//         </div>
//       )}

//       <div
//         className="h-[22vh] p-6 flex items-center justify-between bg-yellow-400 gap-4"
//         onClick={() => setFinishRidePanel(true)}
//       >
//         <h5 className="text-lg font-semibold">
//           {distance ? `${distance}` : "Calculating..."}
//         </h5>
//         <button
//           onClick={calculateDistance}
//           className="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-full shadow hover:bg-blue-700 transition"
//         >
//           Get Distance
//         </button>
//         <button className="bg-green-600 text-white font-semibold p-3 px-10 rounded-lg">
//           Complete Ride
//         </button>
//       </div>

//       <div
//         ref={finishRidePanelRef}
//         className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
//       >
//         <FinishRide ride={ride} setFinishRidePanel={setFinishRidePanel} />
//       </div>
//     </div>
//   );
// };

// export default CaptainRiding;




import React, { useRef, useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";
import FinishRide from "../components/FinishRide";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import { SocketContext } from "../context/SocketContext";
import { LocationContext } from "../context/LocationContext";
import logo from '../assets/logoo.png'

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);
  const location = useLocation();
  const ride = location.state?.ride;
  const navigate = useNavigate();
  const [latP, setLatP] = useState(ride?.pickupLat);
  const [latD, setLatD] = useState(ride?.destLat);
  const [lngP, setLngP] = useState(ride?.pickupLng);
  const [lngD, setLngD] = useState(ride?.destLng);
  const { socket } = useContext(SocketContext);
  const { location: currentLocation } = useContext(LocationContext);

  const [distance, setDistance] = useState(null); // Add this line to define distance state
  useEffect(() => {
    if (!socket) return;

    const handlePaymentSuccess = (data) => {
      alert(`Payment of ₹${Math.round(data.amount)} received from user!`);
    };

     const handleCashPaymentSelected = (data) => {
    alert(`💵 Customer will pay ₹${Math.round(data.amount)} in cash`);
  };


    socket.on("payment-success", handlePaymentSuccess);
    socket.on("cash-payment-selected", handleCashPaymentSelected);

    return () => {
      socket.off("payment-success", handlePaymentSuccess);
       socket.off("cash-payment-selected", handleCashPaymentSelected);
    };
  }, [socket]);

  // useEffect(() => {
  //   if (currentLocation && ride?.destLat && ride?.destLng) {
  //     calculateDistance(currentLocation);
  //   }
  // }, [currentLocation]);

  useEffect(() => {
    if (!ride) navigate("/"); // or any default route
  }, [ride]);

  const calculateDistance = async (currentLocation) => {
    console.log("📍 calculateDistance() triggered");
    const originLat = currentLocation.lat;
    const originLng = currentLocation.lng;
    const destLat = Number(ride?.destLat);
    const destLng = Number(ride?.destLng);

    if (!originLat || !originLng || !destLat || !destLng) {
      console.error("❌ Missing coordinates:", { originLat, originLng, destLat, destLng });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/getdistby`,
        {
          params: { originLat, originLng, destLat, destLng },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Distance response:", response.data);

      const rawDistance = response.data?.distance;
      if (rawDistance && typeof rawDistance === "string") {
        const numericDistance = parseFloat(rawDistance.replace(/[^\d.]/g, ""));
        if (!isNaN(numericDistance)) {
          setDistance(numericDistance);
        } else {
          console.warn("Distance was not numeric:", rawDistance);
        }
      } else {
        console.warn("Distance is missing or invalid:", rawDistance);
      }
      


    } catch (error) {
      console.error("🔥 Error while calling distance API:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  };

  useEffect(() => {
    if (
      ride?.pickupLat &&
      ride?.pickupLng &&
      ride?.destLat &&
      ride?.destLng
    ) {
      setLatP(ride.pickupLat);
      setLngP(ride.pickupLng);
      setLatD(ride.destLat);
      setLngD(ride.destLng);
    }
  }, [ride]);

  const areCoordsValid = [latP, latD, lngP, lngD].every(
    (val) => val !== undefined && val !== null && !isNaN(parseFloat(val))
  );

  useGSAP(
    function () {
      if (finishRidePanel) {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
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
        console.log("Captain logout worked");
        navigate("/captain-login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const isReady = areCoordsValid && currentLocation?.lat && currentLocation?.lng;

  return (
    <div className="relative h-screen bg-slate-50 font-['Inter'] overflow-hidden">
      {/* Top Header */}
      <div className="fixed p-4 top-0 left-0 right-0 bg-white/80 backdrop-blur-xl z-20 flex items-center justify-between border-b border-slate-200/50 shadow-sm">
        <img
          className="w-20 h-auto"
          src={logo}
          alt="Logo"
        />
        <button
          onClick={handleLogout}
          className="h-10 w-10 bg-slate-100 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-200 hover:text-black transition-colors"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </button>
      </div>

      {/* Map Content */}
      {/* Map Content */}
      {isReady ? (
        <div className="absolute inset-0 z-0 w-full h-full">
          <LiveTracking
            destination={{
              lat: Number(ride?.destLat),
              lng: Number(ride?.destLng),
            }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-slate-100">
           <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full"></div>
        </div>
      )}

      {/* Modernized Bottom Panel */}
      <div className="absolute bottom-0 left-0 w-full z-10 bg-white/95 backdrop-blur-2xl rounded-t-[2.5rem] shadow-[0_-20px_40px_rgba(0,0,0,0.1)] p-8 pb-12 border-t border-slate-100 transition-all duration-300">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
          <div className="flex items-center justify-between w-full max-w-lg mx-auto">
          {/* Info Section */}
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
               <i className="ri-route-line text-2xl"></i>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Distance</span>
              <h5 className="text-2xl font-black text-slate-800 tracking-tight">
                {distance ? `${distance} KM` : <span className="text-lg opacity-50 font-semibold">-- KM</span>}
              </h5>
              {ride?.rideMode && (
                <div className="mt-1 flex items-center gap-1.5 font-bold text-[11px] text-slate-500 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded-full w-fit">
                  <i className="ri-steering-2-fill text-blue-500"></i>
                  {ride.rideMode}
                </div>
              )}
            </div>
          </div>
          
          {/* Actions Section */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => calculateDistance(currentLocation)}
              className="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 hover:text-slate-800 transition-colors duration-300 flex items-center justify-center gap-1 active:scale-95"
            >
              <i className="ri-map-pin-line"></i> Get Distance
            </button>
            <button 
              onClick={() => setFinishRidePanel(true)}
              className="bg-black text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Complete Ride <i className="ri-check-double-line text-lg"></i>
            </button>
          </div>
        </div>
      </div>

      <div
        ref={finishRidePanelRef}
        className="fixed w-full z-50 bottom-0 translate-y-full bg-white px-3 py-10 pt-12 rounded-t-[2.5rem] shadow-2xl"
      >
        <FinishRide
        ride={ride}
         distance={typeof distance === "number" ? distance : 0}
         setFinishRidePanel={setFinishRidePanel}
        />
      </div>
    </div>
  );
};

export default CaptainRiding;


