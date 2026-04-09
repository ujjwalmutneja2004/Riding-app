import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WalletHistoryDrawer = ({ isOpen = true, onClose }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/settlement-history`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setHistory(response.data);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchHistory();
        }
    }, [isOpen]);

    return (
        <div className="h-full flex flex-col flex-1 min-h-0 font-['Inter']">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Wallet History</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Settlements & Cashouts</p>
                </div>
                <button 
                    onClick={onClose}
                    className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                >
                    <i className="ri-close-line text-2xl"></i>
                </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin h-6 w-6 border-2 border-black border-t-transparent rounded-full"></div>
                    </div>
                ) : history.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                             <i className="ri-history-line text-3xl"></i>
                        </div>
                        <p className="text-sm font-medium text-gray-400">No transactions recorded yet</p>
                    </div>
                ) : (
                    history.map((item) => (
                        <div key={item._id} className="p-5 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center justify-between hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${item.type === 'CASHOUT' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                                    <i className={`ri-${item.type === 'CASHOUT' ? 'bank-card-line' : 'hand-coin-line'} text-xl`}></i>
                                </div>
                                <div>
                                    <p className="text-sm font-black text-gray-800">{item.type === 'CASHOUT' ? 'Cashout to Bank' : 'Company Settlement'}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">
                                        {new Date(item.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric'})} 
                                        {item.bankDetails?.maskedAccountNumber ? ` • ${item.bankDetails.maskedAccountNumber}` : ` • ${item.paymentMethod}`}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-sm font-black ${item.type === 'CASHOUT' ? 'text-red-500' : 'text-green-600'}`}>
                                    {item.type === 'CASHOUT' ? '-' : '+'}₹{item.amount.toFixed(2)}
                                </p>
                                <span className="text-[8px] font-black uppercase tracking-widest bg-white px-2 py-0.5 rounded-full border border-gray-100 text-gray-400 shadow-sm">
                                    {item.status}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                 <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">TravelX Secure Settlements</p>
            </div>
        </div>
    );
};

export default WalletHistoryDrawer;
