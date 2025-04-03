import React from 'react';

const LocationSearchPanel = ({ setVehiclePanel, setPanelOpen }) => {
    // console.log(props);
    
  // Sample locations
  const locations = [
    "24B, near Kapoor Hospital, New Delhi",
    "22B, near cafe, New Delhi",
    "21B, near Ampana, New Delhi",
    "18B, near Sharma's cafe, Bhopal",
  ];

  return (
    <div>
      {locations.map((location, index) => (
        <div
          key={index}
          onClick={() => {
            setVehiclePanel(true);
            setPanelOpen(false);
          }}
          className="flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start cursor-pointer"
        >
          <h2 className="bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full">
            <i className="ri-map-pin-fill"></i>
          </h2>
          <h4 className="font-medium">{location}</h4>
        </div>
      ))}
    </div>
  );
};

export default LocationSearchPanel;
