import React from 'react'

const RidePopUp = (props) => {
  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => props.setRidePopupPanel(false)}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5">New Ride Available!</h3>

      <div className="flex items-center justify-between bg-yellow-300 rounded-lg mt-4">
        <div className="flex items-center gap-3 ">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="data:image/jpeg;base64,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"
          ></img>
          <h2 className='text-lg font-medium'>Harsh patel</h2>
        </div>

        <h5 className='text-lg font-semiibold'>2.2 KM </h5>
      </div>

      <div className="flex flex-col gap-2 items-center justify-between">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm -mt-1 text-gray-600">
                Kankariya Talab, Ahmedabad
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm -mt-1 text-gray-600">
                Kankariya Talab, Ahmedabad
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹193.20</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex w-full items-center justify-between">
          <button
            onClick={() => {
              props.setConfirmRidePopupPanel(true);
            }}
            className=" bg-green-600 text-white font-semibold p-3 px-8 rounded-lg"
          >
            Accept
          </button>

          <button
            onClick={() => {
              props.setRidePopupPanel(false);
            }}
            className="mt-1 bg-gray-300 text-gray-700 font-semibold p-3 px-8 rounded-lg"
          >
            Ignore
          </button>
        </div>
      </div>
    </div>
  );
}

export default RidePopUp