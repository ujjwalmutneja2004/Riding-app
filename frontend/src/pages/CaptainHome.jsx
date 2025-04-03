// import React from 'react'
// import { Link } from 'react-router-dom'
// import CaptainDetails from '../components/CaptainDetails'

// const CaptainHome = () => {
//   return (
//     <div className='h-screen'>
//       <div className='fixed p-6 top-0 flex items-center justify-between w-screen '>
//         <img className="w-16" src="https://pngimg.com/d/uber_PNG24.png" alt="" />


//         <Link to='/captain-login' className=' h-8 w-10 bg-white flex itmes-center justify-center rounded-full'>
//           <i className=" text-lg font-medium ri-logout-box-line"></i>
//         </Link>


//       </div>


//       <div className='h-3/5'>
//         <img className='h-full w-full object-fit' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />
//       </div>

//       <div className='h-2/5 p-6'>
//        <CaptainDetails />
//       </div>
//     </div>
//   )
// }

// export default CaptainHome


import React from 'react';
import { useState, useRef,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CaptainDetails from '../components/CaptainDetails';
import RidePopUp from '../components/Ridepopup';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ConfirmRidePopUp from '../components/ConfirmRideUp';
import { Link } from 'react-router-dom';

const CaptainHome = () => {
  const navigate = useNavigate(); 
  
  const[ ridePopupPanel , setRidePopupPanel ] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);


  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null)


  useEffect(() => {
    const timer = setTimeout(() => {
      setRidePopupPanel(true);
    }, 3000);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);






  useGSAP(function() {
    if (ridePopupPanel) {
      gsap.to(ridePopupPanelRef.current, {
        transform: "translateY(0)"
      });
    } else {
      gsap.to(ridePopupPanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  },[ridePopupPanel]);

  useGSAP(
    function () {
      if (confirmRidePopupPanel) {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePopupPanel]
  );









  const handleLogout = async () => {
    try {
      const response = await fetch('/logout', {
        method: 'GET',
        credentials: 'include', // Important for session-based authentication
      });

      if (response.ok) {
        // Clear any authentication tokens if stored
        localStorage.removeItem('token');

        console.log('Captain logout worked');

        // Redirect to login page
        navigate('/captain-login'); 
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };









  return (
    <div className="h-screen">
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
        <img className="w-16" src="https://pngimg.com/d/uber_PNG24.png" alt="Logo" />

        <button
          onClick={handleLogout}
          className="h-8 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-line"></i>
        </button>
      </div>

      <div className="h-3/5">
        <img className="h-full w-full object-cover" src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="Gif" />
      </div>

      <div className="h-2/5 p-6">
        <CaptainDetails />
      </div>

      <div
        ref={ridePopupPanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <RidePopUp
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
        />
      </div>

      {/*Confirm Ride Pop Up panel */}
      <div
        ref={confirmRidePopupPanelRef}
        className="fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <ConfirmRidePopUp
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
        />
      </div>

    </div>
  );
};

export default CaptainHome;
