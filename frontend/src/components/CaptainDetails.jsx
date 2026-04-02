import React, { useContext, useEffect, useState } from 'react'
import { CaptainDataContext } from '../context/CaptainContext';
import axios from 'axios';

const CaptainDetails = () => {
    const [earnings, setEarningsData] = useState(null);
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

    useEffect(() => {
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

    if (!earnings) {
        return <div>Loading earnings data...</div>;
    }

    const isNegative = walletData.wallet < 0;
    const threshold = 100;

    return (
        <div className="relative">
            <div className='flex items-center justify-between'>
                <div className='flex items-center justify-start gap-3'>
                    <img className='h-12 w-12 rounded-full object-cover border-2 border-gray-200' src="https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg" alt="captain" />
                    <div>
                        <h4 className='text-lg font-bold capitalize text-gray-800 leading-tight'>{captain.fullname.firstname + " " + captain.fullname.lastname}</h4>
                        <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Elite Captain</p>
                    </div>
                </div>

                <div className="text-right">
                    <div className="flex flex-col items-end">
                        <span className={`text-2xl font-black ${isNegative ? 'text-red-500' : 'text-green-600'}`}>
                            ₹{Math.abs(walletData.wallet).toFixed(2)}
                        </span>
                        <p className='text-[10px] font-bold text-gray-400 uppercase tracking-tighter'>
                            {isNegative ? 'Unpaid Commission' : 'Redeemable Balance'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <h5 className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Earnings</h5>
                    <p className="text-xl font-bold text-gray-800">₹{walletData.totalEarnings.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-center">
                    {isNegative ? (
                        <button 
                            onClick={handleSettle}
                            className="w-full h-full bg-red-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-red-200 active:scale-95 transition-transform"
                        >
                            Settle Now
                        </button>
                    ) : (
                        <button 
                            onClick={() => setShowCashoutModal(true)}
                            disabled={walletData.wallet < threshold}
                            className={`w-full h-full rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95 ${walletData.wallet >= threshold ? 'bg-black text-white shadow-gray-300' : 'bg-gray-100 text-gray-400 shadow-none cursor-not-allowed'}`}
                        >
                            Cashout
                        </button>
                    )}
                </div>
            </div>

            <div className='flex p-4 mt-6 bg-white border border-gray-100 rounded-[2rem] justify-around shadow-sm'>
                <div className='text-center'>
                    <i className="text-xl text-gray-400 ri-map-pin-line"></i>
                    <h5 className='text-sm font-bold text-gray-800'>{Math.round(earnings.totaldistance)}</h5>
                    <p className='text-[9px] text-gray-400 uppercase font-bold tracking-tight'>KM</p>
                </div>

                <div className='text-center border-x border-gray-100 px-8'>
                    <i className="text-xl text-gray-400 ri-time-line"></i>
                    <h5 className='text-sm font-bold text-gray-800'>{(earnings.totalduration / 60).toFixed(1)}</h5>
                    <p className='text-[9px] text-gray-400 uppercase font-bold tracking-tight'>HRS</p>
                </div>

                <div className='text-center'>
                    <i className="text-xl text-gray-400 ri-booklet-line"></i>
                    <h5 className='text-sm font-bold text-gray-800'>{earnings.totalRides}</h5>
                    <p className='text-[9px] text-gray-400 uppercase font-bold tracking-tight'>RIDES</p>
                </div>
            </div>

            {/* Cashout Modal */}
            {showCashoutModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-bold text-gray-800">Cashout Earnings</h3>
                            <button onClick={() => setShowCashoutModal(false)} className="text-gray-400 hover:text-black">
                                <i className="ri-close-line text-2xl"></i>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">Account Holder Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter full name"
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-black transition-all"
                                    value={bankDetails.accountHolder}
                                    onChange={(e) => setBankDetails({...bankDetails, accountHolder: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">Bank Account Number</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter account number"
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-black transition-all"
                                    value={bankDetails.accountNumber}
                                    onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">IFSC Code</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter IFSC code"
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-black transition-all"
                                    value={bankDetails.ifscCode}
                                    onChange={(e) => setBankDetails({...bankDetails, ifscCode: e.target.value})}
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleCashout}
                            className="w-full py-4 bg-black text-white rounded-2xl font-bold mt-8 shadow-xl active:scale-[0.98] transition-transform"
                        >
                            Request ₹{walletData.wallet.toFixed(2)}
                        </button>
                        <p className="text-center text-[10px] text-gray-400 mt-4 font-medium uppercase tracking-wider">Payments are processed within 24-48 hours</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CaptainDetails
