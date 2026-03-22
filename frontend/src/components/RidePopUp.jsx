import React,{useState,useEffect} from 'react'
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
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => props.setRidePopupPanel(false)}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5">New Ride Available!</h3>

   <div className="flex items-center justify-between bg-yellow-300 rounded-lg mt-4 p-3">
  
  <div className="flex items-center gap-3">
  
    <div
      className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold ${getColor(
        props.ride?.user?.fullname?.firstname
      )}`}
    >
      {getInitials(props.ride?.user)}
    </div>

    <h2 className="text-lg font-medium capitalize">
      {props.ride?.user?.fullname?.firstname}{" "}
      {props.ride?.user?.fullname?.lastname}
    </h2>
  </div>

  <h5 className="text-lg font-semibold">
    {distance ? `${distance}` : "Calculating..."}
  </h5>

</div>

      {props.ride?.rideMode && (
        <div className="bg-gray-100 p-3 rounded-lg mt-4 border-l-4 border-black flex items-center gap-3">
          <i className="ri-steering-2-fill text-xl"></i>
          <div>
            <h4 className="font-semibold text-md">{props.ride.rideMode}</h4>
            <p className="text-xs text-gray-600">
              {props.ride.rideMode === 'Work Mode' ? 'Silent ride, shortest route.' : 
               props.ride.rideMode === 'Chill Mode' ? 'Music allowed, casual conversation.' : 
               props.ride.rideMode === 'Urgent Mode' ? 'Fastest route, priority driver.' : ''}
            </p>
          </div>
        </div>
      )}

       <button
  onClick={calculateDistance}
  className="px-4 py-2 mt-4 text-sm bg-yellow-500 text-black font-medium rounded-full shadow-md hover:bg-yellow-600 transition duration-300 ml-auto"
>
  Get Distance
</button>

      <div className="flex flex-col gap-2 items-center justify-between">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.pickup}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.destination}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹{Math.round(props.ride?.fare ?? 0)}</h3>
              <p className="text-sm -mt-1 text-gray-600">Card</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex w-full items-center justify-between">
          <button
            onClick={() => {
              props.setConfirmRidePopupPanel(true);
              props.confirmRide()
            }}
            className=" bg-green-600 text-white font-semibold p-3 px-8 rounded-lg"
          >
            Accept
          </button>

          <button
            onClick={() => {
              props.setRidePopupPanel(false);
            }}
            className="mt-1 bg-gray-300 text-gray-700 font-semibold p-3 px-8 rounded-lg"
          >
            Ignore
          </button>
        </div>
      </div>
    </div>
  );
}

export default RidePopUp
