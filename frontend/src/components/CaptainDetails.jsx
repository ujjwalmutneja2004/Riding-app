import React, { useContext, useEffect, useState } from 'react'
import { CaptainDataContext } from '../context/CaptainContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CaptainDetails = () => {
  const navigate = useNavigate();
  const [earnings, setEarningsData] = useState(null);

  // New Wallet & Cashout state
  const [walletData, setWalletData] = useState({ wallet: 0, totalEarnings: 0 });
  const [showCashoutModal, setShowCashoutModal] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    ifscCode: '',
    accountHolder: ''
  });

  const { captain } = useContext(CaptainDataContext);

  const fetchWalletStatus = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/wallet-status`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setWalletData(response.data);
    } catch (error) {
      console.error("Error fetching wallet status:", error);
    }
  };

  useEffect(() => {
    // API call for earnings
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
      fetchWalletStatus();
    }

  }, [captain]);

  const handleCashout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/cashout`, { bankDetails }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert("Cashout request submitted successfully!");
      setShowCashoutModal(false);
      fetchWalletStatus();
    } catch (error) {
      alert(error.response?.data?.message || "Cashout failed");
    }
  };

  const handleSettle = async () => {
    if (!window.confirm("Confirm you have paid the amount to TravelX?")) return;
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/settle-wallet`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert("Wallet settled successfully!");
      fetchWalletStatus();
    } catch (error) {
      alert("Settlement failed");
    }
  };

  if (!captain) {
    return <div>Loading captain details...</div>;
  }

  if (!earnings || !walletData) {
    return <div>Loading data...</div>;
  }

  const isNegative = walletData.wallet < 0;
  const threshold = 100;

  return (
    <div className="bg-surface-container-lowest/85 backdrop-blur-2xl rounded-[1.5rem] sm:rounded-[2.5rem] p-4 sm:p-6 shadow-[0_24px_48px_rgba(0,0,0,0.08)] border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            {captain?.documents?.selfie ? (
              <img
                alt="Captain Profile"
                className="w-16 h-16 rounded-3xl object-cover shadow-sm"
                src={captain.documents.selfie}
              />
            ) : (
              <img
                alt="Captain Avatar"
                className="w-16 h-16 rounded-3xl object-cover shadow-sm"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhej1VeXrzoMrSADuzd5L5n7KId6O7nw9F-6cSUeS3VZE8i67IMYEncqhG7U9W8xzFkeCpUSibdItns_KAvRjMHphJuAbxFb8dLzfYnDVNH2XBFW_riVpuRHfkFAebM2jBTeFsGiNXARu3-fxDbpgrS6I5L1WrMk84PeKiFGn4i6m91dvyTTYO6lj7LgL_rKQ4L1MGJV1rD8HKEGPJPG3BQgxSmSEdiKkscCFYaT5KaqAUpJ0WW7NLXYsN4zMAeWou4Ob8iafVPgQ"
              />
            )}
            <div className={`absolute -bottom-1 -right-1 h-6 w-6 border-4 border-white rounded-full transition-colors duration-300 ${captain?.isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-on-surface capitalize">
              {captain.fullname.firstname + " " + captain.fullname.lastname}
            </h2>
            <p className="text-on-surface-variant text-sm font-medium">Captain Platinum</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-0.5 sm:mb-1">Today's Earnings</p>
          <p className="text-xl sm:text-2xl font-black text-primary">₹{(earnings.totalFare * 0.8).toFixed(2)}</p>
        </div>
      </div>

      {/* Wallet Display Section */}
      <div className="flex items-center justify-between mb-6 sm:mb-8 bg-surface-container-low p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-white/40 shadow-sm">
          <div className="text-left">
            <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">
               {isNegative ? 'Unpaid Commission' : 'Redeemable Balance'}
            </p>
            <p className={`text-xl sm:text-2xl font-black ${isNegative ? 'text-red-500' : 'text-green-600'}`}>
                ₹{Math.abs(walletData.wallet).toFixed(2)}
            </p>
          </div>
          <div>
            {isNegative ? (
                 <button 
                   onClick={handleSettle} 
                   className="bg-red-500 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-red-500/20 active:scale-95 transition-all">
                   Settle Now
                 </button>
            ) : (
               <button 
                  onClick={() => setShowCashoutModal(true)} 
                  disabled={walletData.wallet < threshold}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 ${walletData.wallet >= threshold ? 'bg-primary text-on-primary shadow-primary/20 hover:opacity-90' : 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'}`}
               >Cashout</button>
            )}
          </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-surface-container-low rounded-2xl sm:rounded-3xl p-2 sm:p-4 flex flex-col items-center justify-center text-center">
          <i className="ri-route-line text-primary mb-1 sm:mb-2 text-lg sm:text-xl"></i>
          <span className="text-xs sm:text-sm font-black text-on-surface">{Math.round(earnings.totaldistance)} KM</span>
          <span className="text-[9px] sm:text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">Distance</span>
        </div>
        <div className="bg-surface-container-low rounded-3xl p-4 flex flex-col items-center justify-center text-center">
          <i className="ri-timer-line text-primary mb-1 sm:mb-2 text-lg sm:text-xl"></i>
          <span className="text-xs sm:text-sm font-black text-on-surface">{(earnings.totalduration / 60).toFixed(1)} HRS</span>
          <span className="text-[9px] sm:text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">Online</span>
        </div>
        <div className="bg-surface-container-low rounded-3xl p-4 flex flex-col items-center justify-center text-center">
          <i className="ri-taxi-fill text-primary mb-1 sm:mb-2 text-lg sm:text-xl"></i>
          <span className="text-xs sm:text-sm font-black text-on-surface">{earnings.totalRides}</span>
          <span className="text-[9px] sm:text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">Rides</span>
        </div>
      </div>

      <button 
        onClick={() => navigate('/captain-dashboard')}
        className="mt-4 sm:mt-6 w-full py-3.5 sm:py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-xl sm:rounded-2xl shadow-[0_8px_24px_rgba(0,73,230,0.3)] hover:opacity-90 transition-all active:scale-[0.98]">
        View Earnings Details
      </button>

      {/* Cashout Modal with Local UI Style */}
      {showCashoutModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
              <div className="bg-surface-container-lowest w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300 pointer-events-auto">
                  <div className="flex justify-between items-center mb-8">
                      <h3 className="text-2xl font-bold text-on-surface">Cashout Earnings</h3>
                      <button onClick={() => setShowCashoutModal(false)} className="text-on-surface-variant hover:text-on-surface transition-colors p-2 rounded-full hover:bg-surface-container-low">
                          <i className="ri-close-line text-2xl"></i>
                      </button>
                  </div>

                  <div className="space-y-4">
                      <div>
                          <label className="text-[10px] font-bold text-on-surface-variant uppercase ml-2 mb-1 block">Account Holder Name</label>
                          <input 
                              type="text" 
                              placeholder="Enter full name"
                              className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all text-on-surface placeholder:text-on-surface-variant/50"
                              value={bankDetails.accountHolder}
                              onChange={(e) => setBankDetails({...bankDetails, accountHolder: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="text-[10px] font-bold text-on-surface-variant uppercase ml-2 mb-1 block">Bank Account Number</label>
                          <input 
                              type="text" 
                              placeholder="Enter account number"
                              className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all text-on-surface placeholder:text-on-surface-variant/50"
                              value={bankDetails.accountNumber}
                              onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="text-[10px] font-bold text-on-surface-variant uppercase ml-2 mb-1 block">IFSC Code</label>
                          <input 
                              type="text" 
                              placeholder="Enter IFSC code"
                              className="w-full bg-surface-container-low border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all text-on-surface placeholder:text-on-surface-variant/50"
                              value={bankDetails.ifscCode}
                              onChange={(e) => setBankDetails({...bankDetails, ifscCode: e.target.value})}
                          />
                      </div>
                  </div>

                  <button 
                      onClick={handleCashout}
                      className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold mt-8 shadow-[0_8px_24px_rgba(0,73,230,0.3)] active:scale-[0.98] transition-all hover:opacity-90"
                  >
                      Request ₹{walletData.wallet.toFixed(2)}
                  </button>
                  <p className="text-center text-[10px] text-on-surface-variant mt-4 font-medium uppercase tracking-wider">Payments are processed within 24-48 hours</p>
              </div>
          </div>
      )}
    </div>
  )
}

export default CaptainDetails
