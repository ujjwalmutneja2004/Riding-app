import React from 'react';
import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CaptainDetails from '../components/CaptainDetails';
import RidePopUp from '../components/RidePopUp';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ConfirmRidePopUp from '../components/ConfirmRideUp';
import { Link } from 'react-router-dom';
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CaptainContext';
import WalletHistoryDrawer from '../components/WalletHistoryDrawer';
import logo from '../assets/logoo.png';

import axios from 'axios';

const CaptainHome = () => {
    const navigate = useNavigate();

    const [ridePopupPanel, setRidePopupPanel] = useState(false);
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
    const [walletHistoryPanel, setWalletHistoryPanel] = useState(false);
    const [captainLocation, setCaptainLocation] = useState(null);

    const ridePopupPanelRef = useRef(null);
    const confirmRidePopupPanelRef = useRef(null);
    const walletHistoryPanelRef = useRef(null);

    const { socket } = useContext(SocketContext);
    const { captain } = useContext(CaptainDataContext);
    const [ride, setRide] = useState(null);

    useEffect(() => {
        if (!captain?._id) return;

        socket.emit('join', {
            userId: captain._id,
            userType: 'captain'
        });

        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        setCaptainLocation({ lat, lng });
                        socket.emit('update-location-captain', {
                            userId: captain._id,
                            location: { lat, lng }
                        });
                    },
                    (error) => {
                        console.error("❌ Geolocation error:", error.message);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    }
                );
            }
        };

        updateLocation();
        const locationInterval = setInterval(updateLocation, 10000);
        return () => clearInterval(locationInterval);

    }, [captain, socket]);

    socket.on('new-ride', (data) => {
        setRide(data);
        setRidePopupPanel(true);
    })

    async function confirmRide() {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm-ride`, {
            rideId: ride._id,
            captainId: captain._id,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        setRidePopupPanel(false);
        setConfirmRidePopupPanel(true);
    }

    useGSAP(function () {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, { transform: "translateY(0)" });
        } else {
            gsap.to(ridePopupPanelRef.current, { transform: "translateY(100%)" });
        }
    }, [ridePopupPanel]);

    useGSAP(function () {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, { transform: "translateY(0)" });
        } else {
            gsap.to(confirmRidePopupPanelRef.current, { transform: "translateY(100%)" });
        }
    }, [confirmRidePopupPanel]);

    useGSAP(function () {
        if (walletHistoryPanel) {
            gsap.to(walletHistoryPanelRef.current, { transform: "translateY(0)" });
        } else {
            gsap.to(walletHistoryPanelRef.current, { transform: "translateY(100%)" });
        }
    }, [walletHistoryPanel]);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/logout`, {}, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            if (response.status === 200) {
                localStorage.removeItem('token');
                navigate('/captain-login');
            }
        } catch (error) {
            console.error('Error logging out:', error.response?.data || error.message);
        }
    };

    return (
        <div className="h-screen relative overflow-hidden">
            {/* Header */}
            <div className="fixed p-6 top-0 flex items-center justify-between w-screen z-20">
                <div>
                   <img className="w-20 h-15" src={logo} alt="Logo" />
                </div>

                <div className="flex items-center gap-3">
                    {/* New Wallet History Button */}
                    <button
                        onClick={() => setWalletHistoryPanel(true)}
                        className="h-10 w-10 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-center rounded-full border border-gray-50 text-gray-800 hover:bg-black hover:text-white transition-all active:scale-90"
                        title="Wallet History"
                    >
                        <i className="text-lg ri-wallet-3-line"></i>
                    </button>

                    <button
                        onClick={() => navigate('/captain-history')}
                        className="h-10 w-10 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-center rounded-full border border-gray-50 hover:bg-black hover:text-white transition-all active:scale-90"
                        title="Ride History"
                    >
                        <i className="text-lg ri-history-line"></i>
                    </button>

                    <button
                        onClick={() => navigate('/captain-dashboard')}
                        className="h-10 w-10 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-center rounded-full border border-gray-50 hover:bg-black hover:text-white transition-all active:scale-90"
                        title="Analytics"
                    >
                        <i className="text-lg ri-bar-chart-grouped-line"></i>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="h-10 w-10 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-center rounded-full border border-gray-50 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90"
                        title="Sign Out"
                    >
                        <i className="text-lg ri-logout-box-line"></i>
                    </button>
                </div>
            </div>

            {/* Map Placeholder */}
            <div className="h-3/5">
                <img className="h-full w-full object-cover" src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="Map" />
            </div>

            {/* Captain Details Wrapper */}
            <div className="h-2/5 p-6 bg-white relative z-10 shadow-[0_-10px_50px_rgba(0,0,0,0.05)] rounded-t-[3rem]">
                <CaptainDetails />
            </div>

            {/* Wallet History Drawer */}
            <div
                ref={walletHistoryPanelRef}
                className="fixed w-full h-[85vh] z-30 bottom-0 translate-y-full bg-white px-8 py-10 rounded-t-[3rem] shadow-[0_-20px_100px_rgba(0,0,0,0.15)] border-t border-gray-100"
            >
                <WalletHistoryDrawer onClose={() => setWalletHistoryPanel(false)} />
            </div>

            {/* Ride PopUp panel */}
            <div
                ref={ridePopupPanelRef}
                className="fixed w-full z-40 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
            >
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={confirmRide}
                />
            </div>

            {/* Confirm Ride Pop Up panel */}
            <div
                ref={confirmRidePopupPanelRef}
                className="fixed w-full h-screen z-50 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
            >
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    setRidePopupPanel={setRidePopupPanel}
                    captainLocation={captainLocation}
                />
            </div>
        </div>
    );
};

export default CaptainHome;
