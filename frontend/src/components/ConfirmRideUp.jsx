import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const ConfirmRidePopUp = (props) => {
  const [otp,setOtp] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const ride = location.state?.ride;


  
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
                    const destLat = Number(props.ride?.destLat);  // Ensure it's a number
                    const destLng = Number(props.ride?.destLng);  // Ensure it's a number
    
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
        navigate('/captain-riding',{state:{ride:props.ride}});
      }
    } catch (error) {
      console.error('Start ride failed:', error.response?.data || error.message);
      alert('Something went wrong while starting the ride.');
    }
  };



  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => props.setConfirmRidePopupPanel(false)}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5">Confirm This ride to Start</h3>

      <div className="flex items-center justify-between bg-yellow-300 rounded-lg mt-4">
        <div className="flex items-center gap-3 ">
          <img
            className="h-10 w-10 rounded-full mt-2 mb-2 ml-2 object-cover"
            src="https://toppng.com/uploads/preview/stock-person-png-stock-photo-man-11563049686zqeb9zmqjd.png"
          ></img>
          <h2 className="text-lg font-medium capitalize">{props.ride?.user.fullname.firstname}</h2>
        </div>
       

        <h5 className="text-lg font-semiibold mr-2" >{distance ? `${distance}` : 'Calculating...'}</h5>
      </div>
      <button
  onClick={calculateDistance}
  className="px-4 py-2 mt-4 text-sm to-blue-800 text-black font-medium rounded-full shadow-md hover:bg-yellow-600 transition duration-300 ml-auto"
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
              <h3 className="text-lg font-medium">₹{props.ride?.fare}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
            </div>
          </div>
        </div>

        

        <div className="w-full mt-6">
          <form onSubmit={submitHandler}>
          <input value={otp} onChange={(e)=>setOtp(e.target.value)}


            type="text"
            placeholder="Enter OTP"
            className="bg-[#eee] px-5 py-2 font-mono text-lg rounded-lg w-full mt-3"></input>
          <button
            onClick={() => {
              // props.setVehicleFound(true);
              props.setConfirmRidePopupPanel(false);
            }}
            className="w-full mt-5 flex justify-center text-lg  bg-green-600 text-white font-semibold p-2 rounded-lg"
          >
            Confirm
            </button>

          <button
            onClick={() => {
              props.setConfirmRidePopupPanel(false);
              props.setRidePopupPanel(false);
            }}
            className="w-full mt-3 text-lg bg-red-600 text-white font-semibold p-2 rounded-lg"
          >
            Cancel
          </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ConfirmRidePopUp