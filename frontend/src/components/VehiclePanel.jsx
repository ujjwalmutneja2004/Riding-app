import React from 'react';

const VehiclePanel = ({selectVehicle, fare,setVehiclePanel, setConfirmRidePanel }) => {
  return (
    <div>
      <h5 className="p-1 text-center w-[93%] absolute top-0" 
          onClick={() => setVehiclePanel(false)}>
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5">Choose a vehicle</h3>

      <div onClick={() =>{
        selectVehicle("car")   
      setConfirmRidePanel(true)}}
           className="flex border-2 active:border-black rounded-lg mb-2 w-full p-3 items-center justify-between">
        <img className="h-10" src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png" alt="carpng"/>
        <div className="ml-2 w-1/2">
          <h4 className="font-medium text-base"> UberGo <span><i className="ri-user-3-fill"></i>4</span></h4>
          <h5 className="font-medium text-sm">2 min away</h5>
          <p className="font-medium text-xs">Affordable, compact rides</p>
        </div>
        <h2 className="text-lg font-semibold">
        { fare && fare.car != null ? `₹ ${fare.car.toFixed(0)}` : "Calculating..."}
        </h2>
      </div>

      <div onClick={() =>{ setConfirmRidePanel(true)
        selectVehicle("motorcycle") 
      }}
           className="flex border-2 active:border-black rounded-lg mb-2 w-full p-3 items-center justify-between">
        <img className="h-10" src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png" alt="carpng"/>
        <div className="-ml-2 w-1/2">
          <h4 className="font-medium text-base"> Moto <span><i className="ri-user-3-fill"></i>1</span></h4>
          <h5 className="font-medium text-sm">3 min away</h5>
          <p className="font-medium text-xs">Affordable MotorCycle Ride</p>
        </div>
        <h2 className="text-lg font-semibold">
            {fare && fare.motorcycle != null ? `₹ ${fare.motorcycle.toFixed(0)}` : "Calculating..."}
        </h2>

      </div>

      <div onClick={() =>{ setConfirmRidePanel(true)
         selectVehicle("auto") 
      }}
           className="flex border-2 active:border-black rounded-lg mb-2 w-full p-3 items-center justify-between">
        <img className="h-10" src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png" alt="carpng"/>
        <div className="ml-2 w-1/2">
          <h4 className="font-medium text-base"> Uber Auto <span><i className="ri-user-3-fill"></i>3</span></h4>
          <h5 className="font-medium text-sm">2 min away</h5>
          <p className="font-medium text-xs">Affordable Auto rides</p>
        </div>
        <h2 className="text-lg font-semibold">
        {fare && fare.auto != null ? `₹ ${fare.auto.toFixed(0)}` : "Calculating..."}
        </h2>
   
      </div>
    </div>
  );
};

export default VehiclePanel;