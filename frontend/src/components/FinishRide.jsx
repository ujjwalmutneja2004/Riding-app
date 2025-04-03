import React from 'react'
import { Link } from 'react-router-dom';

const FinishRide = (props) => {
    return (
        <div>
            <h5
                className="p-1 text-center w-[93%] absolute top-0"
                onClick={() => props.setFinishRidePanel(false)}
            >
                <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
            </h5>

            <h3 className="text-2xl font-semibold mb-5">Finish this Ride</h3>

            <div className="flex items-center justify-between p-4 border-2 bg-yellow-300 rounded-lg mt-4">
                <div className="flex items-center gap-3 ">
                    <img
                        className="h-10 w-10 rounded-full mt-2 mb-2 ml-2 object-cover"
                        src="https://toppng.com/uploads/preview/stock-person-png-stock-photo-man-11563049686zqeb9zmqjd.png"
                    ></img>
                    <h2 className="text-lg font-medium">Harsh patel</h2>
                </div>

                <h5 className="text-lg font-semiibold mr-2" >2.2 KM </h5>
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



                <div className="w-full mt-6">
                        <Link to='/captain-home'
                            className="w-full mt-5 flex justify-center text-lg  bg-green-600 text-white font-semibold p-2 rounded-lg"
                        >
                            Finish Ride
                        </Link>
                        <p className='mt-10 text-xs'>Click on Finish Ride Button if you have Completed the Payment</p>
                   
                </div>
            </div>

        </div>

    )
}

export default FinishRide