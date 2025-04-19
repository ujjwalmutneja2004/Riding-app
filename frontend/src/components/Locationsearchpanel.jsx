// // import React from 'react';

// // const LocationSearchPanel = ({ setVehiclePanel, setPanelOpen }) => {
// //     // console.log(props);
    
// //   // Sample locations
// //   const locations = [
// //     "24B, near Kapoor Hospital, New Delhi",
// //     "22B, near cafe, New Delhi",
// //     "21B, near Ampana, New Delhi",
// //     "18B, near Sharma's cafe, Bhopal",
// //   ];

// //   return (
// //     <div>
// //       {locations.map((location, index) => (
// //         <div
// //           key={index}
// //           onClick={() => {
// //             setVehiclePanel(true);
// //             setPanelOpen(false);
// //           }}
// //           className="flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start cursor-pointer"
// //         >
// //           <h2 className="bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full">
// //             <i className="ri-map-pin-fill"></i>
// //           </h2>
// //           <h4 className="font-medium">{location}</h4>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export default LocationSearchPanel;



const LocationSearchPanel = ({
  setVehiclePanel,
  setPanelOpen,
  setPickup,
  setDestination,
  suggestions,
  focusedField,
}) => {
  return (
    <div>
      {Array.isArray(suggestions) && suggestions.length > 0 ? (
        suggestions.map((suggestion, index) => (
          <div
            key={index}
            onClick={() => {
              const locationDescription = suggestion.description;

              if (focusedField === "pickup") {
                setPickup(locationDescription);
              } else if (focusedField === "destination") {
                setDestination(locationDescription);
              }
            }}
            className="flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start cursor-pointer"
          >
            <div className="bg-[#eee] h-10 w-10 flex items-center justify-center rounded-full text-xl">
              <i className="ri-map-pin-fill"></i>
            </div>
            <div className="flex flex-col">
              <h4 className="font-medium">
                {suggestion.structured_formatting?.main_text}
              </h4>
              <p className="text-sm text-gray-500">
                {suggestion.structured_formatting?.secondary_text}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-center">No suggestions found.</p>
      )}
    </div>
  );
};

export default LocationSearchPanel;
