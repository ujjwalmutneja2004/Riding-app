import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const ConfirmRidePopUp = (props) => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const ride = location.state?.ride;

  const cancelRide = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/cancel-ride-captain`, {
        rideId: props.ride._id
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      props.setConfirmRidePopupPanel(false);
      props.setRidePopupPanel(false);
    } catch (error) {
      console.error("Error cancelling ride:", error);
    }
  };

  const [distance, setDistance] = useState(null);

  // Function to calculate distance between captain's current location and destination
  // Function to calculate distance between captain's current location and destination
  const calculateDistance = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const originLat = currentLocation.lat;
          const originLng = currentLocation.lng;
          const destLat = Number(props.ride?.pickupLat);  // Ensure it's a number
          const destLng = Number(props.ride?.pickupLng);  // Ensure it's a number

          // Check if any coordinates are missing
          if (!originLat || !originLng || !destLat || !destLng) {
            console.error('❌ Missing coordinates:', { originLat, originLng, destLat, destLng });
            return; // Prevent further execution if coordinates are missing
          }

          try {
            const token = localStorage.getItem("token"); // replace if token stored differently

            const response = await axios.get(
              `${import.meta.env.VITE_BASE_URL}/maps/getdistby`,
              {
                params: { originLat, originLng, destLat, destLng },
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            console.log("Distance response:", response.data);

            if (response.data && response.data.distance && response.data.time) {
              setDistance(response.data.distance);
            }
          } catch (error) {
            console.error('Error Response:', error.response);
            console.log("Current Location:", currentLocation.lat, currentLocation.lng);
            console.log("Destination Coordinates:", props.ride?.destLat, props.ride?.destLng);
            console.error('🔥 Error while calling /get-distance-time:', {
              message: error.message,
              status: error.response?.status,
              data: error.response?.data,
            });
          }
        },
        (error) => {
          console.error('❌ Error getting current location:', error);
        }
      );
    } else {
      console.error('❌ Geolocation is not supported by this browser.');
    }
  };












  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
        params: {
          rideId: props.ride._id,
          otp: otp
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 200) {
        props.setConfirmRidePopupPanel(false);
        props.setRidePopupPanel(false);
        navigate('/captain-riding', { state: { ride: props.ride } });
      }
    } catch (error) {
      console.error('Start ride failed:', error.response?.data || error.message);
      alert('Something went wrong while starting the ride.');
    }
  };

  const getInitials = (user) => {
    const first = user?.fullname?.firstname?.[0] || "";
    const last = user?.fullname?.lastname?.[0] || "";
    return (first + last).toUpperCase();
  };

  const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500"];

  const getColor = (name) => {
    if (!name) return "bg-gray-400";
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };


  return (
    <div className="w-full bg-white rounded-[2.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.15)] flex flex-col h-full max-h-[85vh]">
      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-surface-container-low border-b border-surface-container-highest rounded-t-[2.5rem]">
        <div className="flex items-center gap-3 pl-2">
          <i className="ri-shield-check-fill text-[#0052FF] text-2xl"></i>
          <h2 className="font-headline text-xl font-extrabold tracking-tight text-on-surface">Confirm Route</h2>
        </div>
        <button
          onClick={() => props.setConfirmRidePopupPanel(false)}
          className="p-2 bg-surface-container-high rounded-full active:scale-95 transition-transform"
        >
          <i className="ri-arrow-down-s-line text-on-surface text-2xl leading-none"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* User Info Block */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border-2 border-surface-container-high shadow-lg">
                <span className="text-primary font-black text-2xl uppercase">
                  {props.ride?.user?.fullname?.firstname?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary w-6 h-6 rounded-lg flex items-center justify-center border-2 border-white">
                <i className="ri-star-fill text-[14px]"></i>
              </div>
            </div>
            <div>
              <h3 className="font-headline text-lg font-bold leading-tight capitalize">
                {props.ride?.user?.fullname?.firstname}
              </h3>
              <p className="text-on-surface-variant text-sm flex items-center gap-1 font-medium mt-1">
                <i className="ri-map-pin-user-fill text-sm text-primary"></i>
                {distance ? distance : 'Calculating...'} away
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={calculateDistance}
            className="bg-primary/10 text-primary p-3 rounded-2xl active:scale-95 transition-transform"
          >
            <i className="ri-refresh-line text-xl"></i>
          </button>
        </div>

        {/* Ride Mode Info */}
        {props.ride?.rideMode && (
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-3 flex items-start gap-3">
            <div className="bg-[#0052FF] text-white p-2 rounded-xl">
              <i className="ri-flashlight-fill text-xl"></i>
            </div>
            <div>
              <h4 className="font-headline font-bold text-[#0052FF]">{props.ride.rideMode}</h4>
              <p className="text-xs text-on-surface-variant mt-1">
                {props.ride.rideMode === 'Work Mode' ? 'Silent ride, shortest route.' :
                  props.ride.rideMode === 'Chill Mode' ? 'Music allowed, casual conversation.' :
                    props.ride.rideMode === 'Urgent Mode' ? 'Fastest route, priority driver.' : ''}
              </p>
            </div>
          </div>
        )}

        {/* Details List (Dropoff/Pickup) */}
        <div className="space-y-4 bg-surface-container-lowest p-5 rounded-3xl border border-surface-container-high/50 shadow-sm">
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/10"></div>
              <div className="w-[2px] h-full bg-surface-container-highest my-1"></div>
            </div>
            <div className="pb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Pickup</p>
              <p className="font-headline font-bold text-base line-clamp-2">{props.ride?.pickup}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded bg-inverse-surface mt-1"></div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Destination</p>
              <p className="font-headline font-bold text-base line-clamp-2">{props.ride?.destination}</p>
            </div>
          </div>
        </div>

        {/* Fare & Payment Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-low p-3 rounded-2xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Fare Estimate</p>
            <p className="font-headline text-2xl font-black text-primary">₹{Math.round(props.ride?.fare ?? 0)}</p>
          </div>
          <div className="bg-surface-container-low p-3 rounded-2xl justify-center flex flex-col items-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Payment</p>
            <div className="flex items-center gap-2">
              <i className="ri-bank-card-line text-primary text-lg"></i>
              <span className="font-headline font-bold text-base text-primary">Cash/Card</span>
            </div>
          </div>
        </div>
      </div>

      {/* OTP and Actions */}
      <div className="p-5 bg-surface-container-lowest border-t border-surface-container-highest shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-b-[2.5rem]">
        <form onSubmit={submitHandler} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-2 flex items-center gap-1">
              <i className="ri-shield-keyhole-line text-sm border-r border-surface-container-highest pr-1"></i>
              Passenger PIN
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                <i className="ri-lock-password-fill text-surface-container-highest text-xl" />
              </div>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                type="text"
                placeholder="---"
                maxLength={6}
                className="bg-surface-container-low/50 border-2 border-surface-container-high text-on-surface text-center font-mono font-black text-3xl tracking-[0.5em] rounded-2xl w-full py-4 pl-14 pr-4 focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-surface-container-highest shadow-inner"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={cancelRide}
              className="bg-red-50 text-red-600 font-headline font-bold py-4 rounded-2xl active:scale-95 transition-transform"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-br from-[#00c853] to-[#00a343] text-white font-headline font-black text-lg py-4 rounded-2xl shadow-lg shadow-green-500/20 active:scale-95 transition-transform disabled:opacity-50 disabled:grayscale disabled:active:scale-100 flex items-center justify-center gap-2"
              disabled={!otp || otp.length < 3}
            >
              Start Trip <i className="ri-arrow-right-line"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConfirmRidePopUp
