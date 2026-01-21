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
          <h4 className="font-medium text-base"> RideSwiftGo <span><i className="ri-user-3-fill"></i>4</span></h4>
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
        <img className="h-12" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnCwXru-a8075FntgQ3foHUrsz7PXsRH4ZMTgP9MFn8A&s&ec=121507586" alt="carpng"/>
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
        <img className="h-12" src="https://img.icons8.com/color/1200/auto-rickshaw.jpg" alt="carpng"/>
        <div className="ml-2 w-1/2">
          <h4 className="font-medium text-base">Auto <span><i className="ri-user-3-fill"></i>3</span></h4>
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
