import React from 'react';

const RideModePanel = (props) => {
  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => props.setRideModePanelOpen(false)}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line cursor-pointer"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">Choose Ride Purpose</h3>

      <div className="flex flex-col gap-4">
        {/* Work Mode */}
        <div 
          onClick={() => props.setRideMode('Work Mode')}
          className={`border-2 p-3 rounded-xl cursor-pointer ${props.rideMode === 'Work Mode' ? 'border-black' : 'border-gray-200'} active:border-black`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="ri-briefcase-line text-2xl"></i>
              <div>
                <h4 className="font-medium text-lg">Work Mode</h4>
                <p className="text-sm text-gray-600">Silent ride, no calls, shortest route.</p>
              </div>
            </div>
            {props.rideMode === 'Work Mode' && <i className="ri-checkbox-circle-fill text-green-600 text-xl"></i>}
          </div>
        </div>

        {/* Chill Mode */}
        <div 
          onClick={() => props.setRideMode('Chill Mode')}
          className={`border-2 p-3 rounded-xl cursor-pointer ${props.rideMode === 'Chill Mode' ? 'border-black' : 'border-gray-200'} active:border-black`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="ri-music-2-line text-2xl"></i>
              <div>
                <h4 className="font-medium text-lg">Chill Mode</h4>
                <p className="text-sm text-gray-600">Music allowed, casual conversation.</p>
              </div>
            </div>
            {props.rideMode === 'Chill Mode' && <i className="ri-checkbox-circle-fill text-green-600 text-xl"></i>}
          </div>
        </div>

        {/* Urgent Mode */}
        <div 
          onClick={() => props.setRideMode('Urgent Mode')}
          className={`border-2 p-3 rounded-xl cursor-pointer ${props.rideMode === 'Urgent Mode' ? 'border-black' : 'border-gray-200'} active:border-black`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="ri-flashlight-line text-2xl text-yellow-500"></i>
              <div>
                <h4 className="font-medium text-lg">Urgent Mode</h4>
                <p className="text-sm text-gray-600">Fastest route, driver gets priority.</p>
              </div>
            </div>
            {props.rideMode === 'Urgent Mode' && <i className="ri-checkbox-circle-fill text-green-600 text-xl"></i>}
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          props.setRideModePanelOpen(false);
          props.setConfirmRidePanel(true);
        }}
        className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg"
      >
        Continue
      </button>
    </div>
  );
};

export default RideModePanel;
