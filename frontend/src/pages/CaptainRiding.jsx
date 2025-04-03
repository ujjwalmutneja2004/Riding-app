import React ,{useRef,useState}from 'react'
import { Link , useNavigate} from 'react-router-dom';
import FinishRide from '../components/FinishRide';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';



    // const handleLogout = async () => {
    //     try {
    //       const response = await fetch("http://localhost:4000/captains/logout", {
    //         method: "GET",
    //         credentials: "include", // Ensures cookies are sent with the request
    //       });
    
    //       if (response.ok) {
    //         navigate("/captain-home"); // Redirecting after logout
    //       } else {
    //         console.error("Logout failed");
    //       }
    //     } catch (error) {
    //       console.error("Error during logout:", error);
    //     }
    //   };



const CaptainRiding = () => {
  const [finishRidePanel,setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);

    const navigate = useNavigate();
    
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

      <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
         
      }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>

      {/* <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
        <img
          className="w-16 "
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png"
          alt=""
        />
        <Link
          to="/captain-home"
          className=" h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div> */}
       <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
      <img
        className="w-16"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png"
        alt="Uber Logo"
      />
      <button
        onClick={handleLogout}
        className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
      >
        <i className="text-lg font-medium ri-logout-box-r-line"></i>
      </button>
    </div>






      <div className="h-4/5 ">
        <img
          className="h-full w-full object-cover"
          src="https://user-images.githubusercontent.com/6416095/52931260-c6bb5e80-3371-11e9-9d46-83f7d1389d18.gif"
          alt="map"
        />
      </div>

      <div className="h-1/5 p-6 flex items-center justify-between bg-yellow-400 "
      onClick={()=> setFinishRidePanel(true)}
      >
        <h4 className='text-xl font-semibold'>4 KM AWAY</h4>
        <button className='bg-green-600 text-white font-semibold p-3 px-10 rounded-lg'>Complete Ride</button>
      </div>

      <div
        ref={finishRidePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <FinishRide setFinishRidePanel={setFinishRidePanel} 
        />
      </div>

      

      
    </div>
  );
}

export default CaptainRiding