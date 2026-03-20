/*import { Link } from "react-router-dom";
import logo from '../assets/logoo.png'
const Start = () => {
  return (
    <div>
      <div className=" bg-cover bg-bottom bg-[url('/imagea.webp')]  h-screen pt-8 flex justify-between flex-col w-full bg-red-400">
{/*     <img className='w-16 ml-8 'src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png" alt="logo" /> *//*}
          <img className="w-2 h-2 mb-1" src={logo} /> 
        <div className="bg-white pb-7 py-4 px-4">
           <h2 className="text-2xl font-bold">Get Started With TravelX</h2>
            <Link to='/login' className="flex items-center justify-center w-full bg-black text-white py-3 rounded mt-5">Continue</Link>
            </div>
      </div>
    </div>
  )
}

export default Start;*/

import { Link } from "react-router-dom";
import logo from "../assets/logoo.png";
import cover from "../assets/3671579.jpg";
import covermobile from "../assets/mobileview.png";

const Start = () => {
  return (
    <div className="min-h-screen w-full relative">
      {/* Desktop Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden sm:block"
        style={{ backgroundImage: `url(${cover})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/30 to-transparent pointer-events-none" />
      </div>

      {/* Mobile Background */}
      <div
        className="absolute inset-0 bg-cover bg-top bg-no-repeat block sm:hidden"
        style={{ backgroundImage: `url(${covermobile})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/30 to-transparent pointer-events-none" />
      </div>

      {/* Content layers */}
      <div className="relative z-10 min-h-screen flex flex-col px-5 py-6 sm:px-8 md:px-10 lg:px-12">
        {/* Logo at top */}
        <div className="flex-shrink-0">
          <img
            className="h-10 sm:h-12 md:h-14 w-auto object-contain drop-shadow-lg"
            src={logo}
            alt="TravelX Logo"
          />
        </div>

        {/* Spacer */}
        <div className="flex-grow" />

        {/* Bottom content */}
        <div className="pb-8 md:pb-12">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 lg:p-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight md:flex-1">
                Get Started With TravelX
              </h2>

              <Link
                to="/login"
                className="
                  flex items-center justify-center 
                  min-w-[180px] md:min-w-[220px]
                  bg-gradient-to-r from-gray-900 to-black 
                  text-white 
                  font-semibold text-base sm:text-lg md:text-xl 
                  py-3.5 md:py-4 px-8 
                  rounded-2xl 
                  shadow-lg 
                  hover:from-gray-800 hover:to-gray-950 
                  hover:shadow-xl 
                  active:scale-95 
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700
                "
              >
                Continue
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Start;
