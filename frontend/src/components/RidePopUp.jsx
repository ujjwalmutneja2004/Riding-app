import React, { useState, useEffect } from 'react'
import axios from 'axios'

const RidePopUp = (props) => {


  const [distance, setDistance] = useState(null);

  // Function to calculate distance between captain's current location and pickup location
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
          const pickupLat = Number(props.ride?.pickupLat);
          const pickupLng = Number(props.ride?.pickupLng);

          // Check if any coordinates are missing
          if (!originLat || !originLng || !pickupLat || !pickupLng) {
            console.error('❌ Missing coordinates:', {
              originLat, originLng, pickupLat, pickupLng
            });
            return;
          }

          try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
              `${import.meta.env.VITE_BASE_URL}/maps/getdistby`,
              {
                params: {
                  originLat,
                  originLng,
                  //here i didn;t changed destlat as my backedn excepts destLat as query 
                  destLat: pickupLat,
                  destLng: pickupLng,
                },
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            console.log("Distance response:", response.data);

            if (response.data?.distance && response.data?.time) {
              setDistance(response.data.distance);
            }
          } catch (error) {
            console.error('Error Response:', error.response);
            console.log("Current Location:", originLat, originLng);
            console.log("Pickup Coordinates:", pickupLat, pickupLng);
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
    <div className="w-full bg-white rounded-[2.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.15)] overflow-hidden">
      {/* Urgent Header */}
      <div className="p-4 flex justify-between items-center bg-[#0052FF]">
        <div className="flex items-center gap-3">
          <i className="ri-error-warning-fill text-white text-xl"></i>
          <h2 className="font-headline text-xl font-extrabold tracking-tight text-white">New Ride Available!</h2>
        </div>
        <button
          onClick={() => props.setRidePopupPanel(false)}
          className="p-1"
        >
          <i className="ri-arrow-down-s-line text-white text-3xl"></i>
        </button>
      </div>

      {/* Content Body */}
      <div className="p-5 space-y-4">
        {/* User Info Block */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg ${getColor(props.ride?.user?.fullname?.firstname)}`}>
                {getInitials(props.ride?.user)}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary w-6 h-6 rounded-lg flex items-center justify-center border-2 border-white">
                <i className="ri-star-fill text-[14px]"></i>
              </div>
            </div>
            <div>
              <h3 className="font-headline text-lg font-bold leading-tight capitalize">
                {props.ride?.user?.fullname?.firstname} {props.ride?.user?.fullname?.lastname}
              </h3>
              <p className="text-on-surface-variant text-sm flex items-center gap-1 font-medium mt-1">
                <i className="ri-focus-3-line text-sm text-primary"></i>
                {distance ? distance : 'Calculating...'} away
              </p>
            </div>
          </div>
          <div className="bg-surface-container-low px-4 py-2 rounded-xl text-center">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Rating</span>
            <span className="font-headline font-black text-lg">4.92</span>
          </div>
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
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/10"></div>
              <div className="w-[2px] h-full bg-surface-container-highest my-1"></div>
            </div>
            <div className="pb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Pickup</p>
              <p className="font-headline font-bold text-base">{props.ride?.pickup}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded bg-inverse-surface mt-1"></div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Destination</p>
              <p className="font-headline font-bold text-base">{props.ride?.destination}</p>
            </div>
          </div>
        </div>

        {/* Fare & Payment Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-low p-3 rounded-2xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Fare Estimate</p>
            <p className="font-headline text-2xl font-black text-primary">₹{Math.round(props.ride?.fare ?? 0)}</p>
          </div>
          <div className="bg-surface-container-low p-3 rounded-2xl justify-center flex flex-col">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Payment</p>
            <div className="flex items-center gap-2">
              <i className="ri-bank-card-line text-on-surface-variant text-lg"></i>
              <span className="font-headline font-bold text-base">Card</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={calculateDistance}
            className="col-span-2 bg-surface-container-high text-on-surface font-headline font-bold py-3 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <i className="ri-map-pin-line text-xl"></i>
            Get Distance
          </button>
          <button
            onClick={() => props.setRidePopupPanel(false)}
            className="bg-slate-200 text-on-surface-variant font-headline font-bold py-3 rounded-2xl active:scale-95 transition-transform"
          >
            Ignore
          </button>
          <button
            onClick={() => {
              props.confirmRide();
            }}
            className="bg-gradient-to-br from-[#00c853] to-[#00a343] text-white font-headline font-black text-lg py-3 rounded-2xl shadow-lg shadow-green-500/20 active:scale-95 transition-transform"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export default RidePopUp
