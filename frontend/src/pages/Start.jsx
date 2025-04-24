import { Link } from "react-router-dom";
import logo from '../assets/logoo.png'
const Start = () => {
  return (
    <div>
      <div className=" bg-cover bg-bottom bg-[url('/imagea.webp')]  h-screen pt-8 flex justify-between flex-col w-full bg-red-400">
{/*     <img className='w-16 ml-8 'src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png" alt="logo" /> */}
          <img className="w-2 h-2 mb-1" src={logo} /> 
        <div className="bg-white pb-7 py-4 px-4">
           <h2 className="text-2xl font-bold">Get Started With TravelX</h2>
            <Link to='/login' className="flex items-center justify-center w-full bg-black text-white py-3 rounded mt-5">Continue</Link>
            </div>
      </div>
    </div>
  )
}

export default Start;
