// //the effect of when clicking enter destin it goes to top 
// //as flex end so niche se bharna start hota ha 
// // The red div (h-[70%] bg-red-500) is inside a flex container (flex flex-col justify-end).
// // When not hidden, absolute top-0 moves it to the top of the flex container, which is aligned at the bottom.
// // When hidden (hidden class applied), it is removed from the layout, so the other div takes up the space.

// import { useState,useRef } from "react"
// import {useGSAP} from '@gsap/react'
// import gsap from 'gsap'
// import 'remixicon/fonts/remixicon.css'
// import Locationsearchpanel from "../components/Locationsearchpanel"
// import VehiclePanel from "../components/VehiclePanel"
// import ConfirmRide from "../components/ConfirmRide";
// import LookingForDriver from "../components/LookingForDriver"
// import WaitingForDriver from "../components/WaitingForDriver"


// const Homee = () => {
//   const [pickup,setPickup]=useState('')
//   const [destination,setDestination]=useState('')
//   const [panelOpen,setPanelOpen]=useState(false)
//   const vehiclePanelRef=useRef(null)
//   const vehicleClosedPanelRef=useRef(null)
//   const confirmRidePanelRef=useRef(null)
//   const panelRef = useRef(null)
//   const WaitingForDriverRef = useRef(null)



//   const panelCloseRef=useRef(null)
//   const vehicleRef=useRef(null)
//   const vehicleFoundRef=useRef(null)
//   const[vehiclePanel,setVehiclePanel]=useState(false)
//   const[confirmRidePanel,setConfirmPanel]=useState(false)
//   const[vehicleFound,setVehicleFound]=useState(false)
//   const[isWaitingForDriver,setWaitingForDriver]=useState(false)



//   const submitHandler=(e)=>{
//     //so that if user press enetr form do not submit
//     e.preventDefault()

//   }



//   useGSAP(function(){
  
//       if(panelOpen){
//         gsap.to(panelRef.current,{
//          height:'70%',
//          padding:17
//       })
//       gsap.to(panelCloseRef.current,{
//         opacity:1
//       }
//       )

//     }
//     else{
//        gsap.to(panelRef.current,{
//         height:'0%',
//         padding:0
//        })
//        gsap.to(panelCloseRef.current,{
//         opacity:0
//       })
//     }
//   },[panelOpen])

//   useGSAP(() => {
//     gsap.to(vehiclePanelRef.current, { y: vehiclePanel ? 0 : "100%" });
//     gsap.to(vehicleClosedPanelRef.current, { opacity: vehiclePanel ? 1 : 0 });
//   }, [vehiclePanel]);

//   useGSAP(() => {
//     gsap.to(confirmRidePanelRef.current, { y: confirmRidePanel ? 0 : "100%" });
//   }, [confirmRidePanel]);


  
//   useGSAP(function(){
//     if(vehicleFound){
//       gsap.to(vehicleFoundRef.current,{
//         transform:'translateY(0)'
//     })
//   }
//   else{
//      gsap.to(vehicleFoundRef.current,{
//       transform:'translateY(100%)'
//      })
//   }
// },[vehicleFound])

// useGSAP(function(){
//   if(isWaitingForDriver){
//     gsap.to(WaitingForDriverRef.current,{
//       transform:'translateY(0)'
//   })
// }
// else{
//    gsap.to(WaitingForDriverRef.current,{
//     transform:'translateY(100%)'
//    })
// }
// },[isWaitingForDriver])




  
//   return (
//     <div className="h-screen relative overflow-hidden ">
//          <img className='w-16  absolute left-5 top-5 mb-10'src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png" alt="logo" />
        
//         {/* temp map */}
//          <div className='h-screen w-screen'>
//             <img className='h-full w-full object-fit'  src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt=""/>
//          </div>

  
//          <div className="flex flex-col justify-end h-screen absolute top-0 w-full">

//             <div className="h-[30%] p-6 bg-white realtive">
//               <h5 ref={panelCloseRef} onClick ={()=>{
//                 setPanelOpen(false)
//               }}
//                 className="absolute opacity-0 top-6 right-6 text-xl">
//               <i className="ri-arrow-down-wide-fill"></i>
//               </h5>
              
//               <h4 className="text-2xl font-semibold">Find a trip</h4>
//               <form onSubmit={(e)=>{
//                 submitHandler(e)
//               }}>
//                 {/* <div className="line absolute h-5 w-1 top-[48%] left-8 bg-gray-700 rounded-full"> </div> */}
//                 <input 
//                 onClick={()=>{
//                   setPanelOpen(true)
//                 }}
//                 value={pickup}
//                 onChange={(e)=>{
//                   setPickup(e.target.value)
//                 }}
//                 className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-4" type="text" placeholder="Add a pick up location"  ></input>
//                 <input 
//                    onClick={()=>{
//                     setPanelOpen(true)
//                   }}
//                   value={destination}
//                   onChange={(e)=>{
//                     setDestination(e.target.value)
//                   }}
//                 className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-4" type="text" placeholder="Enter your Destination"  ></input>

//               </form>
//            </div>

//       {/* vehicle panel */}
//           <div ref={panelRef} className="  h-[70%] bg-white h-0">
//             <Locationsearchpanel setPanelOpen={setPanelOpen} setVehiclePanel={setVehiclePanel}  
//              setPickup={setPickup}
//              setDestination={setDestination}
//             />
//           </div>
//          </div>


//          {/* vehicle panel confirmed */}

//         <div ref={vehiclePanelRef} className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12">
//         <h5 ref={vehicleClosedPanelRef} 
//             onClick={() => setVehiclePanel(false)}
//             className="absolute opacity-0 right-6 top-6 text-2xl cursor-pointer">
//           <i className="ri-arrow-down-wide-line"></i>
//         </h5>

//         <VehiclePanel setConfirmRidePanel={setConfirmPanel} setVehiclePanel={setVehiclePanel} />
//       </div>


//      {/* Confirm Ride Panel */}
//     <div ref={confirmRidePanelRef} className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12">
//       <ConfirmRide setConfirmRidePanel={setConfirmPanel} setVehicleFound={setVehicleFound} />
//     </div>

//      {/* Confirm Ride Panel */}
//      <div ref={vehicleFoundRef}  className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12">
//         <LookingForDriver setVehicleFound={setVehicleFound}/>
//     </div>

//     <div ref={WaitingForDriverRef} className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12">
//         <WaitingForDriver setWaitingForDriver={setWaitingForDriver} />
//     </div>
   
//     </div>
//   )
// }

// export default Homee
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import Locationsearchpanel from "../components/Locationsearchpanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";

const Homee = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmPanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [isWaitingForDriver, setWaitingForDriver] = useState(false);
  
  const vehiclePanelRef = useRef(null);
  const vehicleClosedPanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const panelRef = useRef(null);
  const WaitingForDriverRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehicleFoundRef = useRef(null);

  const submitHandler = (e) => {
    e.preventDefault();
  };

  useGSAP(() => {
    gsap.to(panelRef.current, { height: panelOpen ? "70%" : "0%", padding: panelOpen ? 17 : 0 });
    gsap.to(panelCloseRef.current, { opacity: panelOpen ? 1 : 0 });
  }, [panelOpen]);

  useGSAP(() => {
    gsap.to(vehiclePanelRef.current, { y: vehiclePanel ? 0 : "100%" });
    gsap.to(vehicleClosedPanelRef.current, { opacity: vehiclePanel ? 1 : 0 });
  }, [vehiclePanel]);

  useGSAP(() => {
    gsap.to(confirmRidePanelRef.current, { y: confirmRidePanel ? 0 : "100%" });
  }, [confirmRidePanel]);

  useGSAP(() => {
    gsap.to(vehicleFoundRef.current, { transform: vehicleFound ? "translateY(0)" : "translateY(100%)" });
  }, [vehicleFound]);

  useGSAP(() => {
    gsap.to(WaitingForDriverRef.current, { transform: isWaitingForDriver ? "translateY(0)" : "translateY(100%)" });
  }, [isWaitingForDriver]);

  const handleLogout = async () => {
    console.log("Logout button clicked");
    try {
      const response = await fetch('http://localhost:4000/users/logoutu', {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem('token');
        console.log("User logout successful");
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="h-screen relative overflow-hidden">
      <img className="w-16 absolute left-5 top-5 mb-10" src="https://upload.wikimedia.org/wikipedia/commons/5/58/Uber_logo_2018.svg" alt="logo" />
      
      <button onClick={handleLogout} className="absolute right-5 top-5 bg-white h-10 w-10 flex items-center justify-center rounded-full shadow-md z-50">
        <i className="text-lg font-medium ri-logout-box-line"></i>
      </button>
      
      <div className="h-screen w-screen">
        <img className="h-full w-full object-cover" src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />
      </div>

      <div className="flex flex-col justify-end h-screen absolute top-0 w-full">
        <div className="h-[30%] p-6 bg-white relative">
          <h5 ref={panelCloseRef} onClick={() => setPanelOpen(false)} className="absolute opacity-0 top-6 right-6 text-xl cursor-pointer">
            <i className="ri-arrow-down-wide-fill"></i>
          </h5>
          <h4 className="text-2xl font-semibold">Find a trip</h4>
          <form onSubmit={submitHandler}>
            <input onClick={() => setPanelOpen(true)} value={pickup} onChange={(e) => setPickup(e.target.value)} className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-4" type="text" placeholder="Add a pick up location" />
            <input onClick={() => setPanelOpen(true)} value={destination} onChange={(e) => setDestination(e.target.value)} className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-4" type="text" placeholder="Enter your Destination" />
          </form>
        </div>

        {/* vehicle panel */}
          <div ref={panelRef} className="  h-[70%] bg-white h-0">
            <Locationsearchpanel setPanelOpen={setPanelOpen} setVehiclePanel={setVehiclePanel}  
             setPickup={setPickup}
             setDestination={setDestination}
            />
          </div>
      </div>

      
         {/* vehicle panel confirmed */}

        <div ref={vehiclePanelRef} className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12">
        <h5 ref={vehicleClosedPanelRef} 
            onClick={() => setVehiclePanel(false)}
            className="absolute opacity-0 right-6 top-6 text-2xl cursor-pointer">
          <i className="ri-arrow-down-wide-line"></i>
        </h5>

        <VehiclePanel setConfirmRidePanel={setConfirmPanel} setVehiclePanel={setVehiclePanel} />
      </div>

      //      {/* Confirm Ride Panel */}
     <div ref={confirmRidePanelRef} className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12">
       <ConfirmRide setConfirmRidePanel={setConfirmPanel} setVehicleFound={setVehicleFound} />
     </div>

     {/* Confirm Ride Panel */}
     <div ref={vehicleFoundRef}  className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12">
        <LookingForDriver setVehicleFound={setVehicleFound}/>
     </div>

     <div ref={WaitingForDriverRef} className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12">
        <WaitingForDriver setWaitingForDriver={setWaitingForDriver} />
      </div>

    </div>
  );
};

export default Homee;
