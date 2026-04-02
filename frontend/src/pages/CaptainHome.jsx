
import React from 'react';
import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CaptainDetails from '../components/CaptainDetails';
import RidePopUp from '../components/RidePopUp';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ConfirmRidePopUp from '../components/ConfirmRideUp';
import { Link } from 'react-router-dom';
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CaptainContext';
import logo from '../assets/logoo.png';

import axios from 'axios';

const CaptainHome = () => {
  const navigate = useNavigate();

  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const [captainLocation, setCaptainLocation] = useState(null);


  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null)

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);
  const [ride, setRide] = useState(null);
  console.log("captainaagya" + captain)


  // useEffect(() => {
  //   socket.emit('join', {
  //     userId: captain._id,
  //     userType: 'captain'
  //   });

  //   const updateLocation = () => {
  //     if (navigator.geolocation) {
  //       console.log("📍 Trying to get current location...");

  //       navigator.geolocation.getCurrentPosition(
  //         (position) => {
  //           console.log("✅ Location fetched:", {
  //             lat: position.coords.latitude,
  //             lng: position.coords.longitude,
  //             accuracy: position.coords.accuracy + " meters"
  //           });


  //             // Update captainLocation state with the new location
  //             setCaptainLocation({
  //               lat: position.coords.latitude,
  //               lng: position.coords.longitude,
  //           });

  //           socket.emit('update-location-captain', {
  //             userId: captain._id,
  //             location: {
  //               lat: position.coords.latitude,
  //               lng: position.coords.longitude
  //             }
  //           });
  //         },
  //         (error) => {
  //           console.error("❌ Geolocation error:", error.message);
  //         },
  //         {
  //           enableHighAccuracy: true,
  //           timeout: 10000,       // Wait max 10 sec
  //           maximumAge: 0         // Always fetch new location, no cache
  //         }
  //       );
  //     } else {
  //       console.error("🚫 Geolocation not supported by this browser.");
  //     }
  //   };

  //   // Call once immediately
  //   updateLocation();

  //   // Repeat every 10 seconds
  //   const locationInterval = setInterval(updateLocation, 10000);

  //   // Cleanup on unmount
  //   return () => clearInterval(locationInterval)
  // });



  useEffect(() => {
    if (!captain?._id) return;




    // Join the socket room
    socket.emit('join', {
      userId: captain._id,
      userType: 'captain'
    });

    // Location updater
    const updateLocation = () => {
      if (navigator.geolocation) {
        console.log("📍 Trying to get current location...");

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const accuracy = position.coords.accuracy;

            console.log("✅ Location fetched:", {
              lat,
              lng,
              accuracy: `${accuracy} meters`
            });

            // Store in state to pass as prop elsewhere
            setCaptainLocation({ lat, lng });

            // Emit to backend
            socket.emit('update-location-captain', {
              userId: captain._id,
              location: { lat, lng }
            });
          },
          (error) => {
            console.error("❌ Geolocation error:", error.message);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      } else {
        console.error("🚫 Geolocation not supported by this browser.");
      }
    };

    // Immediate call
    updateLocation();

    // Repeat every 10 seconds
    const locationInterval = setInterval(updateLocation, 10000);

    // Clean up
    return () => clearInterval(locationInterval);

  }, [captain, socket]);




  //   ✅ What it does:

  // Checks if the browser supports geolocation.

  // If yes:

  // Gets the user's current latitude and longitude.

  // Sends it to the server using socket.emit('update-location-captain', {...}).

  // Logs the location in the browser console.

  // If not:

  // Logs an error saying geolocation isn’t supported

  // As soon as the component mounts, it starts calling updateLocation() every 10 seconds.

  // This means the captain's current location will be sent to the server repeatedly, keeping their position live/updated on the map or backend.

  // On unmount (or component update), it clears the interval to avoid memory leaks




  socket.on('new-ride', (data) => {
    console.log("New ride data received:", data);
    setRide(data);
    setRidePopupPanel(true);
  })

  async function confirmRide() {

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm-ride`, {
      rideId: ride._id,
      captainId: captain._id,

    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    setRidePopupPanel(false);
    setConfirmRidePopupPanel(true);
  }






  useGSAP(function () {
    if (ridePopupPanel) {
      gsap.to(ridePopupPanelRef.current, {
        transform: "translateY(0)"
      });
    } else {
      gsap.to(ridePopupPanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [ridePopupPanel]);

  useGSAP(
    function () {
      if (confirmRidePopupPanel) {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(0)",
          autoAlpha: 1,
        });
      } else {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(100%)",
          autoAlpha: 0,
        });
      }
    },
    [confirmRidePopupPanel]
  );



  // const handleLogout = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await fetch(`${import.meta.env.VITE_BASE_URL}/captains/logout`, {
  //       method: 'POST',
  //       credentials: 'include', // Important for session-based authentication
  //     });

  //     if (response.ok) {
  //       // Clear any authentication tokens if stored
  //       localStorage.removeItem('token');

  //       console.log('Captain logout worked');

  //       // Redirect to login page
  //       navigate('/captain-login'); 
  //     } else {
  //       console.error('Logout failed');
  //     }
  //   } catch (error) {
  //     console.error('Error logging out:', error);
  //   }
  // };


  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        // Clear any authentication tokens if stored
        localStorage.removeItem('token');
        console.log('Captain logout worked');

        // Redirect to login page
        navigate('/captain-login');
      }
    } catch (error) {
      console.error('Error logging out:', error.response?.data || error.message);
    }
  };











  return (
    <div className="bg-surface text-on-surface antialiased overflow-hidden h-screen relative font-headline">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-10 bg-white/85 backdrop-blur-xl border-b-[0.5px] border-slate-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.06)] flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-2">
          <img className="w-16 h-auto" src={logo} alt="Logo" />
        </div>
        <div className="flex items-center gap-1 md:gap-4">
          <button onClick={() => navigate('/captain-history')} className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors active:scale-95 duration-200">
            <i className="text-xl ri-history-line"></i>
          </button>
          <button onClick={() => navigate('/captain-dashboard')} className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors active:scale-95 duration-200">
            <i className="text-xl ri-dashboard-line"></i>
          </button>
          <button onClick={handleLogout} className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors active:scale-95 duration-200">
            <i className="text-xl ri-logout-box-r-line"></i>
          </button>
        </div>
      </header>

      {/* Main Content: Map Canvas */}
      <main className="relative h-screen w-full pt-16 pb-24">
        {/* Map Placeholder */}
        <div className="absolute inset-0 z-0 bg-slate-200">
          <img alt="City Map View" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOirCO0FH4hmQeK7q0ZOTcDxsyCfjDCf7NMHexQcJuzvXR8tLS53UZhBnzQPMgUADRkCOr4FLPqnfeSx8vVuJWrUNjqyNcImx_JUTkUCwMB72ZczhyGNq9pMSyesIeW0y89vs-1YUmFe5bbdREb5mnwturbUWIVJzzdReKdk1u9BGUzQvI16ldJbo3Zbxcg7QSZo2IdEvsCjIivbjMuYg8nH4vKKBpnJD9z-ixMb58iEOlig7KNPSCyfOuoXZexohSNyuErSlpLH8" />
          {/* Map Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60"></div>
          {/* Driver Marker (Kinetic Path style) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/20 scale-150"></div>
              <div className="relative h-12 w-12 bg-primary border-4 border-surface-container-lowest rounded-full shadow-xl flex items-center justify-center">
                <i className="text-white text-xl ri-navigation-fill"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Floating HUD elements */}
        <div className="absolute top-20 right-6 flex flex-col gap-3">
          <button className="h-12 w-12 bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl shadow-lg flex items-center justify-center text-on-surface hover:bg-white transition-all active:scale-95">
            <i className="ri-focus-3-line text-xl"></i>
          </button>
          <button className="h-12 w-12 bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl shadow-lg flex items-center justify-center text-on-surface hover:bg-white transition-all active:scale-95">
            <i className="ri-stack-line text-xl"></i>
          </button>
        </div>

        {/* CaptainDetails Bottom Panel */}
        <section className="absolute bottom-28 left-4 right-4 md:left-auto md:right-8 md:w-[26rem] z-10">
          <CaptainDetails />
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-10 bg-white/90 backdrop-blur-2xl rounded-t-[2rem] shadow-[0_-12px_40px_rgba(0,0,0,0.08)] flex justify-around items-center px-4 pt-3 pb-6">
        <div className="flex flex-col items-center justify-center bg-[#0052FF]/10 text-[#0052FF] rounded-2xl px-5 py-2 scale-110 transition-all duration-300 ease-out cursor-pointer">
          <i className="ri-broadcast-line text-xl mb-1"></i>
          <span className="font-manrope text-[10px] font-semibold uppercase tracking-wider">Go Online</span>
        </div>
        <div onClick={() => navigate('/captain-dashboard')} className="flex flex-col items-center justify-center text-slate-400 px-5 py-2 hover:opacity-80 transition-opacity cursor-pointer">
          <i className="ri-wallet-3-line text-xl mb-1"></i>
          <span className="font-manrope text-[10px] font-semibold uppercase tracking-wider">Earnings</span>
        </div>
        <div onClick={() => navigate('/captain-history')} className="flex flex-col items-center justify-center text-slate-400 px-5 py-2 hover:opacity-80 transition-opacity cursor-pointer">
          <i className="ri-bar-chart-box-line text-xl mb-1"></i>
          <span className="font-manrope text-[10px] font-semibold uppercase tracking-wider">Insights</span>
        </div>
        <div className="flex flex-col items-center justify-center text-slate-400 px-5 py-2 hover:opacity-80 transition-opacity cursor-pointer">
          <i className="ri-user-line text-xl mb-1"></i>
          <span className="font-manrope text-[10px] font-semibold uppercase tracking-wider">Profile</span>
        </div>
      </nav>

      {/* Dark Overlay for Modals */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${ridePopupPanel || confirmRidePopupPanel ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Ride Pop Up panel */}
      <div
        ref={ridePopupPanelRef}
        className="fixed inset-x-0 z-50 bottom-0 translate-y-full px-4 pb-8 flex justify-center pointer-events-none"
      >
        <div className="w-full max-w-md pointer-events-auto">
          <RidePopUp
            ride={ride}
            setRidePopupPanel={setRidePopupPanel}
            setConfirmRidePopupPanel={setConfirmRidePopupPanel}
            confirmRide={confirmRide}
          />
        </div>
      </div>

      {/*Confirm Ride Pop Up panel */}
      <div
        ref={confirmRidePopupPanelRef}
        className="fixed inset-x-0 z-50 bottom-0 translate-y-full opacity-0 px-4 pb-8 flex justify-center pointer-events-none"
      >
        <div className="w-full max-w-md pointer-events-auto">
          <ConfirmRidePopUp
            ride={ride}
            setConfirmRidePopupPanel={setConfirmRidePopupPanel}
            setRidePopupPanel={setRidePopupPanel}
            captainLocation={captainLocation}
          />
        </div>
      </div>
    </div>
  );
};

export default CaptainHome;
