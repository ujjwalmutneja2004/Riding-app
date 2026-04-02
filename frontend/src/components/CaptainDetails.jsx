import React ,{useContext, useEffect, useState} from 'react'
import { CaptainDataContext } from '../context/CaptainContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const CaptainDetails = () => {
  const navigate = useNavigate();
  const [earnings, setEarningsData] = useState(null);

  const { captain } = useContext(CaptainDataContext);
  if (!captain) {
    return <div>Loading captain details...</div>; 
  }
  console.log("captainb"+captain)


  useEffect(() => {
    // API call
    const fetchEarnings = async () => {
      try {
         const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/${captain?._id}/earnings`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
    
        setEarningsData(response.data);
      } catch (error) {
        console.error("Error fetching earnings data:", error);
      }
    };

    if (captain?._id) {
      fetchEarnings();
    }

  }, [captain]);

  if (!earnings) {
    return <div>Loading earnings data...</div>;
  }




  return (
    <div className="bg-surface-container-lowest/85 backdrop-blur-2xl rounded-[2.5rem] p-6 shadow-[0_24px_48px_rgba(0,0,0,0.08)] border border-white/20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              alt="Driver Profile"
              className="w-16 h-16 rounded-3xl object-cover shadow-sm"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhej1VeXrzoMrSADuzd5L5n7KId6O7nw9F-6cSUeS3VZE8i67IMYEncqhG7U9W8xzFkeCpUSibdItns_KAvRjMHphJuAbxFb8dLzfYnDVNH2XBFW_riVpuRHfkFAebM2jBTeFsGiNXARu3-fxDbpgrS6I5L1WrMk84PeKiFGn4i6m91dvyTTYO6lj7LgL_rKQ4L1MGJV1rD8HKEGPJPG3BQgxSmSEdiKkscCFYaT5KaqAUpJ0WW7NLXYsN4zMAeWou4Ob8iafVPgQ"
            />
            <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 border-4 border-white rounded-full"></div>
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-on-surface capitalize">
              {captain.fullname.firstname + " " + captain.fullname.lastname}
            </h2>
            <p className="text-on-surface-variant text-sm font-medium">Captain Platinum</p>
          </div>
        </div>
        <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Today's Earnings</p>
            <p className="text-2xl font-black text-primary">₹{earnings.totalFare.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface-container-low rounded-3xl p-4 flex flex-col items-center justify-center text-center">
          <i className="ri-route-line text-primary mb-2 text-xl"></i>
          <span className="text-sm font-black text-on-surface">{Math.round(earnings.totaldistance)} KM</span>
          <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">Distance</span>
        </div>
        <div className="bg-surface-container-low rounded-3xl p-4 flex flex-col items-center justify-center text-center">
          <i className="ri-timer-line text-primary mb-2 text-xl"></i>
          <span className="text-sm font-black text-on-surface">{(earnings.totalduration / 60).toFixed(1)} HRS</span>
          <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">Online</span>
        </div>
        <div className="bg-surface-container-low rounded-3xl p-4 flex flex-col items-center justify-center text-center">
          <i className="ri-taxi-fill text-primary mb-2 text-xl"></i>
          <span className="text-sm font-black text-on-surface">{earnings.totalRides}</span>
          <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">Rides</span>
        </div>
      </div>
      
      <button 
        onClick={() => navigate('/captain-dashboard')}
        className="mt-6 w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-2xl shadow-[0_8px_24px_rgba(0,73,230,0.3)] hover:opacity-90 transition-all active:scale-[0.98]">
        View Earnings Details
      </button>
    </div>
  )
}

export default CaptainDetails
