
import {  useState, useRef ,useCallback, use, useEffect} from "react";
import axios from 'axios';

import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import Locationsearchpanel from "../components/Locationsearchpanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import { SocketContext } from "../context/SocketContext"
import { useContext } from "react";
import {UserDataContext} from "../context/UserContext"
import logo from "../assets/logoo.png";

const Homee = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(null);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmPanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [isWaitingForDriver, setWaitingForDriver] = useState(false);
  const[vehicleType,setVehicleType]=useState(null)
  // integeration part of the location search to homee.jsx
  const [focusedField, setFocusedField] = useState(null); // "pickup" or "destination"
  const [suggestions, setSuggestions] = useState([]);
  const[ride,setRide]=useState(null)
  const vehiclePanelRef = useRef(null);
  const vehicleClosedPanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const panelRef = useRef(null);
  const WaitingForDriverRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehicleFoundRef = useRef(null);

  const [pickupDebounced, setPickupDebounced] = useState("");
const [destinationDebounced, setDestinationDebounced] = useState("");
  
// const [fare,setFare]=useState({})
const [fare,setFare]=useState({})
 const {socket}=useContext(SocketContext)
 const {user}=useContext(UserDataContext)

 useEffect(() => {
  // console.log("User ID:", user._id);
     socket.emit("join", { userType:"user" ,userId:user._id});
 },[user])


  socket.on("ride-confirmed", ride=> {
    console.log("Ride confirmed and confirmation received to user:", ride);
    setWaitingForDriver(true);
    setVehicleFound(false);
    setRide(ride);
  })

  socket.on('ride-started', ride => {
    setWaitingForDriver(false);
    navigate('/riding',{state:{ride}})
  } )

  const submitHandler = (e) => {
    e.preventDefault();
  };


  useGSAP(() => {
    if (panelOpen === true) {
      gsap.to(panelRef.current, { height: "70%", padding: 17, duration: 0.5 });
      gsap.to(panelCloseRef.current, { opacity: 1, duration: 0.5 });
    } else {
      gsap.to(panelRef.current, { height: "0%", padding: 0, duration: 0.5 });
      gsap.to(panelCloseRef.current, { opacity: 0, duration: 0.5 });
     } 
     //else {
    //   // default preview state on first render
    //   gsap.to(panelRef.current, { height: "10%", padding: 5, duration: 0.5 });
    // }
  }, [panelOpen]);



  useGSAP(() => {
    gsap.to(vehiclePanelRef.current, { y: vehiclePanel ? 0 : "100%" });
    gsap.to(vehicleClosedPanelRef.current, { opacity: vehiclePanel ? 1 : 0 });
  }, [vehiclePanel]);

  useGSAP(() => {
    gsap.to(confirmRidePanelRef.current, { y: confirmRidePanel ? 0 : "100%" });
  }, [confirmRidePanel]);

  useGSAP(() => {
    gsap.to(vehicleFoundRef.current, { transform: vehicleFound ? "translateY(0)" : "translateY(150%)" });
  }, [vehicleFound]);

  useGSAP(() => {
    gsap.to(WaitingForDriverRef.current, { transform: isWaitingForDriver ? "translateY(0)" : "translateY(100%)" });
  }, [isWaitingForDriver]);




 async  function findTrip() {
    if (pickup && destination) {
      setVehiclePanel(true);
      setPanelOpen(false);

      console.log("Pickup:", pickup);
      const response= await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/getfare`, {
        params: {
          pickup,
          destination
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
      )

      console.log("Fare response:",response.data);
      setFare(response.data);
    } else {
      alert("Please select both pickup and destination locations.");
    }
  }






  const handleLogout = async () => {
    console.log("Logout button clicked");
    try {
     // https://29dv0wmq-5173.inc1.devtunnels.ms/users/logoutu
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users/logoutu`, {
        method: "GET",
        credentials:"include",
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

  
  
const fetchSuggestions = async (input) => {
  try {
    const token = localStorage.getItem("token"); // Assuming user token is stored
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions?input=${encodeURIComponent(input)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();

    // ✅ Store the entire prediction objects
    setSuggestions(data?.predictions || []);
  } catch (error) {
    console.error("Suggestion fetch failed:", error);
  }
};

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 200), []);

async function createRide() {
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/rides/create`, // ✅ Base URL from env
    {
      pickup,             // ✅ Payload
      destination,
      vehicleType
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` // ✅ Auth token
      }
    }
  );

  console.log("Ride created:", response.data); // ✅ Output success
}

  return (
    <div className="h-screen relative overflow-hidden">
    {!panelOpen && (
     <img
    className="w-24 h-30 h-auto absolute top-5 left-2 z-50"
    src={logo}
    alt="logo"
     />
    )}
      <button
        onClick={handleLogout}
        className="absolute right-5 top-5 bg-white h-10 w-10 flex items-center justify-center rounded-full shadow-md z-50"
      >
        <i className="text-lg font-medium ri-logout-box-line"></i>
      </button>
      <div className="h-screen w-screen">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt=""
        />
      </div>
      <div className="flex flex-col justify-end h-screen absolute top-0 w-full">
        <div className="h-[30%] p-6 bg-white relative">
          <h5
            ref={panelCloseRef}
            onClick={() => setPanelOpen(false)}
            className="absolute opacity-0 top-6 right-6 text-xl cursor-pointer"
          >
            <i className="ri-arrow-down-wide-fill"></i>
          </h5>
          <h4 className="text-2xl font-semibold">Find a trip</h4>
          <form onSubmit={submitHandler}>
            <input
              onClick={() => {
                setPanelOpen(true);
                setFocusedField("pickup");
              }}
              value={pickup}
              onChange={async (e) => {
                const value = e.target.value;
                setPickup(value);
                debouncedFetchSuggestions(value)
              }}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-4"
              type="text"
              placeholder="Add a pick up location"
            />
            <input
              onClick={() => {
                setPanelOpen(true);
                setFocusedField("destination");
              }}
              value={destination}
              onChange={async (e) => {
                const value = e.target.value;
                setDestination(value);
                debouncedFetchSuggestions(value)
              }}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-4"
              type="text"
              placeholder="Enter your Destination"
            />

            {/* 
          //  <input onClick={() => setPanelOpen(true)} value={pickup} onChange={(e) => setPickup(e.target.value)} className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-4" type="text" placeholder="Add a pick up location" />
          //  <input onClick={() => setPanelOpen(true)} value={destination} onChange={(e) => setDestination(e.target.value)} className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-4" type="text" placeholder="Enter your Destination" />
          */}
          </form>

              <button 
              
                onClick={findTrip}


              className="bg-black text-white w-full py-3 mt-4 rounded-lg font-semibold">
                   Find Trip
              </button>

        </div>

        {/* vehicle panel */}
        <div ref={panelRef} className="  h-[70%] bg-white h-0">
          <Locationsearchpanel
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
            setPickup={setPickup}
            setDestination={setDestination}
            // its for suggestions address
            suggestions={suggestions}
            focusedField={focusedField}
            // its for both field are required to go to the next panel
            pickup={pickup} 
            destination={destination}

          />
        </div>
      </div>


      {/* vehicle panel confirmed */}
      <div
        ref={vehiclePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        {/* <h5
          ref={vehicleClosedPanelRef}
          onClick={() => setVehiclePanel(false)}
          className="absolute opacity-0 right-6 top-6 text-2xl cursor-pointer"
        >
          <i className="ri-arrow-down-wide-line"></i>
        </h5> */}

        <VehiclePanel
          fare={fare}
           selectVehicle={setVehicleType}
          setConfirmRidePanel={setConfirmPanel}
          setVehiclePanel={setVehiclePanel}
        />
      </div>



    {/* Confirm Ride Panel */}
      <div
        ref={confirmRidePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <ConfirmRide
         createRide={createRide}
         pickup={pickup}
         destination={destination}
         fare={fare}
          vehicleType={vehicleType}
          setConfirmRidePanel={setConfirmPanel}
          setVehicleFound={setVehicleFound}
        />
      </div>


      {/* Looking for driver  */}

      {/* ///u is <div> ka reference vehicleFoundRef ke through hold kar raha hai — iska matlab tu baad mein JavaScript se access karega like: */}
      {/* Yeh utility class tailwind ki hai jo basically transform: translateY(100%) karti hai → iska matlab:   
       Ye panel screen ke neeche chala gaya → poori tarah se hidden hai. */}
      <div
        ref={vehicleFoundRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <LookingForDriver 
         createRide={createRide}
         pickup={pickup}
         destination={destination}
         fare={fare}
          vehicleType={vehicleType}
        setVehicleFound={setVehicleFound} />
      </div>


      <div
        ref={WaitingForDriverRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <WaitingForDriver 
        ride={ride}
        setVehicleFound={setVehicleFound}
        WaitingForDriver={WaitingForDriver}
        setWaitingForDriver={setWaitingForDriver} />
      </div>
    </div>
  );
};

export default Homee;
