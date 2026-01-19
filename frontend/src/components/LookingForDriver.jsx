import React from 'react'


const vehicleImages = {
    car: "https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png",
    motorcycle:
      "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
    auto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
  };

const LookingForDriver = ({ createRide,pickup,destination,fare,vehicleType, setVehicleFound }) => {
    return (
        <div>

            <h5 className="p-1 text-center w-[93%] absolute top-0"
                onClick={() => setVehicleFound(false)}>
                <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
            </h5>

            <h3 className="text-2xl font-semibold mb-5">Looking for a Driver</h3>

            <div className='flex gap-2 justify-between flex-col items-center'>
                <img className='h-20' src={vehicleImages[vehicleType]} alt="" />
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill"></i>
                        <div >
                            <h3 className='text-lg font-medium'>PickUp</h3>
                            <p className='text-sm mt-1 text-gray-600'>{pickup}</p>
                        </div>
                    </div>


                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className=" text-lg ri-map-pin-line"></i>
                        <div >
                            <h3 className='text-lg font-medium'>Destination</h3>
                            <p className='text-sm mt-1 text-gray-600'>{destination}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-money-pound-box-fill"></i>
                        <div >
                            <h3 className='text-lg font-medium'>₹{Math.round(fare?.[vehicleType] ?? 0)}</h3>
                            <p className='text-sm mt-1 text-gray-600'>Cash\Card</p>
                        </div>
                    </div>



                </div>
            </div>
        </div>
    )
}

export default LookingForDriver
