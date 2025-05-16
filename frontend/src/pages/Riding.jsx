// import React from 'react'
// import { Link ,useLocation} from 'react-router-dom'
// import { useState,useffect ,useContext} from 'react'
// import { SocketContext } from '../context/SocketContext'
// import { useNavigate } from 'react-router-dom'
// import LiveTracking from '../components/LiveTracking'
// import logo from '../assets/logoo.png';
// const vehicleImages = {
//     car: "https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png",
//     motorcycle:
//       "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
//     auto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
//   };

// const Riding = () => {
//     const location = useLocation();
//     const {ride}=location.state||{}
//     const { socket } = useContext(SocketContext);
//     const navigate=useNavigate()

//     socket.on('ride-ended', () => {
//         navigate('/home')
//     })

//     return (
//         <div className='h-screen'>
//               <img
//               className="w-24 h-30 h-auto absolute top-5 left-2 z-50 "
//                src={logo}
//                alt="logo"
//                  />
            
//             <Link to='/home' className='fixed right-2 mt-4  h-8 w-10 bg-white flex itmes-center justify-center rounded-full'>
//             <i className=" text-lg font-medium ri-home-8-fill"></i>
//             </Link>

//             <div className='60vh'>
//             {/* console.log({ride?.destLat})
//             console.log({ride?.destLng}) */}
// {/*                 <img className='h-full w-full object-fit' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" /> */}
//                  <LiveTracking destination={{ lat: ride?.destLat, lng: ride?.destLng }} /> 
//             </div>

//             <div className='h-1/2 p-4'>
//                 <div className='flex items-center justify-between'>
//                     <img className='h-12' src={vehicleImages[ride?.captain?.vehicle?.vehicleType]} alt="" />
//                     <div className='text-right'>
//                         <h2 className='text-lg font-medium capitalize'>{ride?.captain.fullname.firstname} </h2>
//                         <h4 className='text-xl font-semibold -mt-1 -mb-1'>{ride?.captain.vehicle.plate}</h4>
//                         <p className='text-sm text-gray-600'> </p>
//                     </div>

//                 </div>


//                 <div className='flex gap-2 justify-between flex-col items-center'>
//                     <div className='w-full mt-5'>
//                         <div className='flex items-center gap-5 p-3 border-b-2'>
//                             <i className=" text-lg ri-map-pin-line"></i>
//                             <div >
//                                 <h3 className='text-lg font-medium'>Destination</h3>
//                                 <p className='text-sm mt-1 text-gray-600'>{ride?.destination}</p>
//                             </div>
//                         </div>

//                         <div className='flex items-center gap-5 p-3 '>
//                             <i className="ri-money-pound-box-fill"></i>
//                             <div >
//                                 <h3 className='text-lg font-medium'>${ride?.fare}</h3>
//                                 <p className='text-sm mt-1 text-gray-600'>Cash Cash</p>
//                             </div>
//                         </div>

//                     </div>
//                 </div>
//                 <button className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg'> Make a Payment</button>
//             </div>

//         </div>
//     )
// }

// export default Riding


import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import { SocketContext } from "../context/SocketContext";
import LiveTracking from "../components/LiveTracking";
import logo from "../assets/logoo.png";

// Load Stripe public key from Vite env variable
const stripePromise = loadStripe(import.meta.env.VITE_PUBLISH);

// Subcomponent: Handles Stripe Payment
const PaymentForm = ({ ride }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);





  const handlePayment = async () => {
    setLoading(true);
    const cardElement = elements.getElement(CardElement);

    try {
      const response = await fetch(
        // "http://localhost:4000/api/payment/create-payment-intent",
        `${import.meta.env.VITE_BASE_URL}/api/payment/create-payment-intent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ amount: Math.round(ride?.fare * 100) }),
        }
      );

      if (!response.ok) {
        throw new Error("Payment intent creation failed");
      }

      const { clientSecret } = await response.json();

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: "Customer Name",
          },
        },
      });

      if (paymentResult.error) {
        alert(`Payment failed: ${paymentResult.error.message}`);
      } else {


        await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/payment/confirm`,
    //    "http://localhost:4000/api/payment/confirm",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              rideId: ride._id,
              amount: ride.fare,
            }),
          }
        );

        alert("✅ Payment successful!");
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <CardElement className="p-2 border rounded" />
      <button
        className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg"
        onClick={handlePayment}
        disabled={!stripe || loading}
      >
        {loading ? "Processing..." : "Make a Payment"}
      </button>
    </div>
  );
};

const Riding = () => {
  const location = useLocation();
  const { ride } = location.state || {};
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  // Listen for ride-end event and redirect
  useEffect(() => {
    if (socket) {
      socket.on("ride-ended", () => {
        navigate("/home");
      });
    }

    // Clean up listener on unmount
    return () => {
      if (socket) socket.off("ride-ended");
    };
  }, [socket, navigate]);

  if (!ride) return <p className="p-4">No ride data available.</p>;

 const vehicleImages = {
  car: "https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png",
  auto:
    "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
  moto:
    "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
};

  return (
    <div className="h-screen">
      <img className="w-24 absolute top-5 left-2 z-50" src={logo} alt="logo" />

      <Link
        to="/home"
        className="fixed right-2 mt-4 h-8 w-10 bg-white flex items-center justify-center rounded-full"
      >
        <i className="text-lg font-medium ri-home-8-fill"></i>
      </Link>

      <div className="h-[60vh]">
        <LiveTracking
          destination={{ lat: ride?.destLat, lng: ride?.destLng }}
        />
      </div>

      <div className="h-1/2 p-4 bg-white rounded-t-2xl shadow-inner">
        <div className="flex items-center justify-between mb-3">
          <img
            className="h-12"
            src={vehicleImages[ride?.captain?.vehicle?.vehicleType]}
            alt=""
          />
          <div className="text-right">
            <h2 className="text-lg font-medium capitalize">
              {ride?.captain.fullname.firstname}
            </h2>
            <h4 className="text-xl font-semibold -mt-1 -mb-1">
              {ride?.captain.vehicle.plate}
            </h4>
          </div>
        </div>

        <div className="w-full">
          <div className="flex items-center gap-5 p-3 border-b">
            <i className="text-lg ri-map-pin-line"></i>
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm mt-1 text-gray-600">{ride?.destination}</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-3">
            <i className="ri-money-pound-box-fill text-xl"></i>
            <div>
              <h3 className="text-lg font-medium">${Math.round(ride?.fare)}</h3>
              <p className="text-sm mt-1 text-gray-600">Pay with Card</p>
            </div>
          </div>
        </div>

        <Elements stripe={stripePromise}>
          <PaymentForm ride={ride} />
        </Elements>
      </div>
    </div>
  );
};

export default Riding;

