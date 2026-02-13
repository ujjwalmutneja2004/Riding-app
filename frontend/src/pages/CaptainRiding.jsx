
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
import CaptainLiveTracking from "../components/CaptainLiveTracking";
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
      alert(`Payment of ₹${data.amount} received from user!`);
    };

     const handleCashPaymentSelected = (data) => {
    alert(`💵 Customer will pay ₹${data.amount} in cash`);
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
    <div className=" flex flex-col h-screen">
     <div className="fixed p-4 top-0 left-0 right-0 bg-white z-10 flex items-center justify-between">
       <img
          className="w-20 h-auto"
          src={logo}
          alt="Logo"
        />
        <button
          onClick={handleLogout}
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </button>
      </div>




{isReady ? (
  <div className="flex-1 overflow-hidden">
    <CaptainLiveTracking
      destination={{
        lat: Number(ride?.destLat),
        lng: Number(ride?.destLng),
      }}
      pickup={{
        lat: Number(ride?.pickupLat),
        lng: Number(ride?.pickupLng),
      }}
      captainLocation={currentLocation}
    />
  </div>
) : (
  <div className="flex-1 flex items-center justify-center">
    <p>Loading map...</p>
  </div>
)}

      <div
        className="h-1/5 p-6 flex items-center justify-between bg-yellow-400"
        onClick={() => setFinishRidePanel(true)}
      >
        <h5 className="text-lg font-bold mr-2">
          {distance ? `${distance} KM ` : "Calculating..."}
        </h5>
        <button
          onClick={() => calculateDistance(currentLocation)}
           className="absolute top-4 right-4 px-4 py-2 text-sm bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition duration-300 z-10"
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


