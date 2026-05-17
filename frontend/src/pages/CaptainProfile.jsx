import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaptainDataContext } from '../context/CaptainContext';
import logo from '../assets/logoo.png';

const CaptainProfile = () => {
    const { captain } = useContext(CaptainDataContext);
    const navigate = useNavigate();

    if (!captain) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    const initials = (captain.fullname.firstname[0] + (captain.fullname.lastname ? captain.fullname.lastname[0] : '')).toUpperCase();

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-['Inter']">
            {/* Header / Navbar */}
            <header className="fixed top-0 w-full z-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 h-16 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                    <i className="ri-arrow-left-line text-2xl text-gray-700"></i>
                </button>
                <h1 className="text-lg font-bold text-gray-900">Captain Profile</h1>
                <div className="w-10"></div> {/* Spacer */}
            </header>

            <main className="pt-24 pb-12 px-6 max-w-2xl mx-auto">
                {/* Hero Section */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 mb-6 text-center">
                    <div className="relative inline-block mb-4">
                        {captain.documents?.selfie ? (
                            <img 
                                src={captain.documents.selfie} 
                                alt="Captain Profile" 
                                className="w-24 h-24 rounded-3xl object-cover shadow-xl border-4 border-white"
                            />
                        ) : (
                            <img 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhej1VeXrzoMrSADuzd5L5n7KId6O7nw9F-6cSUeS3VZE8i67IMYEncqhG7U9W8xzFkeCpUSibdItns_KAvRjMHphJuAbxFb8dLzfYnDVNH2XBFW_riVpuRHfkFAebM2jBTeFsGiNXARu3-fxDbpgrS6I5L1WrMk84PeKiFGn4i6m91dvyTTYO6lj7LgL_rKQ4L1MGJV1rD8HKEGPJPG3BQgxSmSEdiKkscCFYaT5KaqAUpJ0WW7NLXYsN4zMAeWou4Ob8iafVPgQ"
                                alt="Captain Avatar" 
                                className="w-24 h-24 rounded-3xl object-cover shadow-xl border-4 border-white"
                            />
                        )}
                        <div className="absolute -bottom-1 -right-1 bg-green-500 border-4 border-white w-8 h-8 rounded-full"></div>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 capitalize mb-1">
                        {captain.fullname.firstname} {captain.fullname.lastname}
                    </h2>
                    <p className="text-gray-500 font-medium mb-6">Captain • TravelX Partner</p>
                    
                    <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-6">
                        <div className="px-1">
                            <p className="text-lg font-black text-gray-900 truncate">{captain.averageRating ? parseFloat(captain.averageRating).toFixed(1) : '4.9'}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Rating</p>
                        </div>
                        <div className="border-x border-gray-100 px-1">
                            <p className="text-lg font-black text-gray-900 truncate">₹{captain.totalEarnings ? captain.totalEarnings.toFixed(0) : '0'}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Earnings</p>
                        </div>
                        <div className="px-1">
                            <p className="text-lg font-black text-green-500 truncate">Active</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Status</p>
                        </div>
                    </div>
                </div>

                {/* Account Details */}
                <div className="space-y-4">
                    <h3 className="px-2 text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Vehicle Information</h3>
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600">
                                <i className="ri-car-fill text-2xl"></i>
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Vehicle Type</p>
                                <p className="text-sm font-bold text-gray-900 capitalize">{captain.vehicle.vehicleType}</p>
                            </div>
                            <div className="text-right">
                                <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">Verified</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600">
                                <i className="ri-id-card-line text-2xl"></i>
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Plate Number</p>
                                <p className="text-sm font-bold text-gray-900 uppercase">{captain.vehicle.plate}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600">
                                <i className="ri-palette-line text-2xl"></i>
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Vehicle Color</p>
                                <p className="text-sm font-bold text-gray-900 capitalize">{captain.vehicle.color}</p>
                            </div>
                        </div>
                    </div>

                    <h3 className="px-2 text-xs font-bold text-gray-400 uppercase tracking-[0.2em] pt-4 mb-2">Personal & Contact</h3>
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-50 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600">
                                <i className="ri-mail-line text-2xl"></i>
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Email Address</p>
                                <p className="text-sm font-bold text-gray-900">{captain.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600">
                                <i className="ri-calendar-event-line text-2xl"></i>
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Partner Since</p>
                                <p className="text-sm font-bold text-gray-900">
                                    {captain.createdAt
                                        ? new Date(captain.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                                        : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logout Button (Quick Access) */}
                <button 
                  onClick={() => {
                      localStorage.removeItem('token');
                      navigate('/captain-login');
                  }}
                  className="w-full mt-8 py-4 bg-red-50 text-red-600 rounded-3xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                >
                    <i className="ri-logout-box-r-line"></i>
                    Sign Out Account
                </button>

                <p className="text-center text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-12">
                    TravelX Partners • v1.4.2
                </p>
            </main>
        </div>
    );
};

export default CaptainProfile;
