import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FinishRide = (props) => {


    const [distance, setDistance] = useState(null);
    const navigate = useNavigate();

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


    async function endRide() {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/end-ride`, {
            rideId: props.ride._id,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })

        if (response.status === 200) {
            navigate('/captain-home')
        }


    }
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

    // useEffect(() => {
    //   calculateDistance();
    //   const interval = setInterval(calculateDistance,100000); // Update every 10 seconds
    //   return () => clearInterval(interval); // Cleanup on unmount
    // }, [props.ride?.destination]);



    ///here i have captain and destination distance 

    return (
        <div>

            <button onClick={calculateDistance}>Get Distance</button>



            <h5
                className="p-1 text-center w-[93%] absolute top-0"
                onClick={() => props.setFinishRidePanel(false)}
            >
                <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
            </h5>

            <h3 className="text-2xl font-semibold mb-5">Finish this Ride</h3>

            <div className="flex items-center justify-between p-4 border-2 bg-yellow-300 rounded-lg mt-4">

                <div className="flex items-center gap-3">

                    <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold ${getColor(
                            props.ride?.user?.fullname?.firstname
                        )}`}
                    >
                        {getInitials(props.ride?.user)}
                    </div>

                    <h2 className="text-lg font-medium capitalize">
                        {props.ride?.user?.fullname?.firstname}
                    </h2>
                </div>

                <h5 className="text-lg font-semibold">
                    {distance ? `${distance}` : "Calculating..."}
                </h5>
            </div>


            <div className="flex flex-col gap-2 items-center justify-between">
                <div className="w-full mt-5">
                    <div className="flex items-center gap-5 p-3 border-b-2">
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className="text-lg font-medium">PickUp</h3>
                            <p className="text-sm -mt-1 text-gray-600">
                                {props.ride?.pickup}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-5 p-3 border-b-2">
                        <i className="ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className="text-lg font-medium">Destination</h3>
                            <p className="text-sm -mt-1 text-gray-600">
                                {props.ride?.destination}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-5 p-3">
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className="text-lg font-medium">₹{Math.round(props.ride?.fare ?? 0)}</h3>
                            <p className="text-sm -mt-1 text-gray-600">Cash/Card</p>
                        </div>
                    </div>
                </div>



                <div className="w-full mt-6">
                    <button
                        onClick={endRide}

                        className="w-full mt-5 flex justify-center text-lg  bg-green-600 text-white font-semibold p-2 rounded-lg"
                    >
                        Finish Ride
                    </button>


                </div>
            </div>

        </div>

    )
}

export default FinishRide
