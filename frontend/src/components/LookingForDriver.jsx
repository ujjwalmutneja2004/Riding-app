import React from 'react'


const vehicleImages = {
    car: "https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png",
    motorcycle:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnCwXru-a8075FntgQ3foHUrsz7PXsRH4ZMTgP9MFn8A&s&ec=121507586",
    auto: "https://img.icons8.com/color/1200/auto-rickshaw.jpg",
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
