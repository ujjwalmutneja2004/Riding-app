import React from 'react'
import { Link ,useLocation} from 'react-router-dom'
import { useState,useffect ,useContext} from 'react'
import { SocketContext } from '../context/SocketContext'
import { useNavigate } from 'react-router-dom'
import LiveTracking from '../components/LiveTracking'
import logo from '../assets/logoo.png';

const vehicleImages = {
    car: "https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png",
    motorcycle:
      "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
    auto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
  };

const Riding = () => {
    const location = useLocation();
    const {ride}=location.state||{}
    const { socket } = useContext(SocketContext);
    const navigate=useNavigate()

    socket.on('ride-ended', () => {
        navigate('/home')
    })

    return (
        <div className='h-screen'>
              <img
              className="w-24 h-30 h-auto absolute top-5 left-2 z-50 "
               src={logo}
               alt="logo"
                 />
            
            <Link to='/home' className='fixed right-2 mt-4  h-8 w-10 bg-white flex itmes-center justify-center rounded-full'>
            <i className=" text-lg font-medium ri-home-8-fill"></i>
            </Link>

            <div className='60vh'>
            {/* console.log({ride?.destLat})
            console.log({ride?.destLng}) */}
{/*                 <img className='h-full w-full object-fit' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" /> */}
                 <LiveTracking destination={{ lat: ride?.destLat, lng: ride?.destLng }} /> 
            </div>

            <div className='h-1/2 p-4'>
                <div className='flex items-center justify-between'>
                    <img className='h-12' src={vehicleImages[ride?.captain?.vehicle?.vehicleType]} alt="" />
                    <div className='text-right'>
                        <h2 className='text-lg font-medium capitalize'>{ride?.captain.fullname.firstname} </h2>
                        <h4 className='text-xl font-semibold -mt-1 -mb-1'>{ride?.captain.vehicle.plate}</h4>
                        <p className='text-sm text-gray-600'> </p>
                    </div>

                </div>


                <div className='flex gap-2 justify-between flex-col items-center'>
                    <div className='w-full mt-5'>
                        <div className='flex items-center gap-5 p-3 border-b-2'>
                            <i className=" text-lg ri-map-pin-line"></i>
                            <div >
                                <h3 className='text-lg font-medium'>Destination</h3>
                                <p className='text-sm mt-1 text-gray-600'>{ride?.destination}</p>
                            </div>
                        </div>

                        <div className='flex items-center gap-5 p-3 '>
                            <i className="ri-money-pound-box-fill"></i>
                            <div >
                                <h3 className='text-lg font-medium'>${ride?.fare}</h3>
                                <p className='text-sm mt-1 text-gray-600'>Cash Cash</p>
                            </div>
                        </div>

                    </div>
                </div>
                <button className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg'> Make a Payment</button>
            </div>

        </div>
    )
}

export default Riding
