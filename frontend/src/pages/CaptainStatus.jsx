import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CaptainDataContext } from '../context/CaptainContext';
import { SocketContext } from '../context/SocketContext';
import logo from '../assets/logoo.png';

const CaptainStatus = () => {
    const { captain, setCaptain } = useContext(CaptainDataContext);
    const { socket } = useContext(SocketContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (socket && captain?._id) {
            socket.emit('join', {
                userId: captain._id,
                userType: 'captain'
            });

            socket.on('captain-status-updated', (data) => {
                setCaptain(prev => ({ ...prev, status: data.status, rejectionReason: data.reason }));
                if (data.status === 'approved') {
                    navigate('/captain-home');
                }
            });
        }
        return () => {
            if (socket) socket.off('captain-status-updated');
        };
    }, [socket, navigate, setCaptain]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.data.captain.status === 'approved') {
                    setCaptain(response.data.captain);
                    navigate('/captain-home');
                } else {
                    setCaptain(response.data.captain);
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
                navigate('/captain-login');
            }
        };

        fetchProfile();
    }, [navigate, setCaptain]);

    if (!captain) return null;

    const isPending = captain.status === 'pending';
    const isRejected = captain.status === 'rejected';

    return (
        <div className="h-screen bg-[#fbf8fd] flex flex-col items-center justify-center p-6 text-center font-['Inter'] relative">
            <button 
                onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/captain-login');
                }}
                className="absolute top-10 right-10 flex items-center gap-2 bg-white px-4 py-2 rounded-2xl text-gray-500 font-medium shadow-sm hover:text-red-600 transition-all border border-[#efedf2]"
            >
                <i className="ri-logout-box-line"></i>
                Sign Out
            </button>
            <img src={logo} alt="TravelX Logo" className="w-32 mb-12" />
            
            <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.05)] border border-[#efedf2]">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${isPending ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
                    <i className={`ri-${isPending ? 'time-line' : 'close-circle-line'} text-4xl`}></i>
                </div>

                <h1 className="text-3xl font-bold text-[#010102] mb-4">
                    {isPending ? 'Approval Pending' : 'Account Rejected'}
                </h1>
                
                <p className="text-gray-500 mb-8 leading-relaxed">
                    {isPending 
                        ? "We're currently reviewing your application. This usually takes 24-48 hours. We'll notify you once you're ready to hit the road!"
                        : `Regrettably, your application was not approved at this time. ${captain.rejectionReason ? `Reason: ${captain.rejectionReason}` : 'Please contact support for more details.'}`
                    }
                </p>

                <div className="space-y-4">
                    <button 
                        onClick={() => window.location.reload()} 
                        className="w-full py-4 bg-[#010102] text-white rounded-2xl font-semibold shadow-lg hover:bg-[#1c1c1e] transition-all"
                    >
                        Check Update
                    </button>
                    
                    <button 
                        onClick={() => {
                            localStorage.removeItem('token');
                            navigate('/captain-login');
                        }}
                        className="w-full py-4 text-gray-500 font-medium hover:text-black transition-all"
                    >
                        Logout and Re-apply
                    </button>
                </div>
            </div>

            <p className="fixed bottom-10 text-xs text-gray-400 uppercase tracking-widest">
                Editorial Logistics & Oversight • TravelX
            </p>
        </div>
    );
};

export default CaptainStatus;
