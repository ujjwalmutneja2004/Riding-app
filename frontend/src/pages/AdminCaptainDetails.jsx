import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import logo from '../assets/logoo.png';

const AdminCaptainDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAllDocs, setShowAllDocs] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/captain/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setData(response.data);
            } catch (err) {
                console.error("Error fetching captain details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/admin/login');
    };

    if (loading) return (
        <div className="min-h-screen bg-[#fbf8fd] flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full"></div>
        </div>
    );

    if (!data) return (
        <div className="min-h-screen bg-[#fbf8fd] flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-black text-gray-900 mb-4">Captain Not Found</h2>
                <button onClick={() => navigate('/admin/captains')} className="px-6 py-2 bg-black text-white rounded-xl font-bold">Back to Fleet</button>
            </div>
        </div>
    );

    const { captain, recentRides, stats } = data;

    return (
        <div className="min-h-screen bg-[#fbf8fd] font-['Inter'] flex">
            {/* Sidebar */}
            <div className="w-64 bg-white h-screen fixed left-0 top-0 p-8 flex flex-col border-r border-[#efedf2] z-20">
                <div className="mb-12">
                    <img src={logo} alt="Logo" className="w-24 mb-2" />
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">TravelX Admin</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Editorial Oversight</p>
                </div>
                
                <nav className="flex-1 space-y-1">
                    <NavItem icon="ri-dashboard-line" label="Dashboard" onClick={() => navigate('/admin/dashboard')} />
                    <NavItem icon="ri-user-follow-line" label="Captain Approvals" onClick={() => navigate('/admin/approvals')} />
                    <NavItem icon="ri-steering-2-line" label="Captains" active onClick={() => navigate('/admin/captains')} />
                </nav>

                <div className="mt-auto pt-6 border-t border-[#efedf2]">
                    <button onClick={handleLogout} className="w-full text-left p-3 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-600 flex items-center gap-3 transition-all">
                        <i className="ri-logout-box-line"></i>
                        <span className="font-bold text-sm">Sign Out</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-12">
                {/* Header with Profile Summary */}
                <header className="mb-12 flex justify-between items-start">
                    <div className="flex items-center gap-8">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                                <img src={captain.documents?.selfie || "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg"} alt="Selfie" className="w-full h-full object-cover" />
                            </div>
                            {captain.isAvailable && <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>}
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">{captain.fullname.firstname} {captain.fullname.lastname}</h1>
                            <div className="flex items-center gap-4">
                                <span className={`text-[10px] font-black px-3 py-1 rounded-full border tracking-widest ${captain.isAvailable ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                                    {captain.isAvailable ? 'ONLINE' : 'OFFLINE'}
                                </span>
                                <div className="flex items-center gap-1 text-sm font-bold text-gray-900">
                                    <i className="ri-star-fill text-yellow-500"></i>
                                    <span>{(captain.averageRating || 5.0).toFixed(2)}</span>
                                </div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">ID: TX-{captain._id.slice(-6).toUpperCase()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-[#efedf2] shadow-sm text-right min-w-[240px]">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Balance</p>
                        <h3 className="text-3xl font-black text-gray-900 mb-4">₹{(captain.wallet || 0).toFixed(2)}</h3>
                        <button className="w-full bg-[#7b5900] text-white py-3 rounded-2xl text-xs font-black tracking-widest shadow-lg shadow-[#7b5900]/20 hover:scale-[1.02] transition-all uppercase">
                            Payout Now
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-12 gap-8 mb-12">
                    {/* Total Life Earnings Card */}
                    <div className="col-span-8 bg-[#010102] rounded-[2.5rem] p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7b5900]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div>
                                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4">Total Life Earnings</h5>
                                <h2 className="text-7xl font-black tracking-tighter mb-4 text-white">₹{stats.totalGross.toFixed(2)}</h2>
                                <div className="flex items-center gap-8">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Net Payout (80%)</p>
                                        <p className="text-xl font-black">₹{stats.netPayout.toFixed(2)}</p>
                                    </div>
                                    <div className="w-px h-10 bg-gray-800"></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Weekly Growth</p>
                                        <p className="text-xl font-black text-green-400 flex items-center gap-1">+12.4% <i className="ri-arrow-right-up-line text-sm"></i></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Platform Fee Card */}
                    <div className="col-span-4 bg-white rounded-[2.5rem] p-8 border border-[#efedf2] shadow-sm flex flex-col justify-between">
                        <div>
                            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Platform Fee Structure</h5>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-600">Standard Cut</span>
                                    <span className="text-lg font-black text-gray-900">20%</span>
                                </div>
                                <div className="h-px bg-gray-50"></div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Fees Paid</p>
                                        <p className="text-2xl font-black text-[#7b5900]">₹{stats.totalPlatformFee.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pt-6 border-t border-[#efedf2]">
                            <p className="text-[9px] text-gray-400 leading-relaxed font-medium">
                                Fees calculated on gross ride fare before tips and tolls.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-8">
                    {/* Recent Ride Activity */}
                    <div className="col-span-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-gray-900">Recent Ride Activity <span className="text-[#7b5900]">——</span></h3>
                            <button className="text-xs font-bold text-[#7b5900] flex items-center gap-1 hover:gap-2 transition-all">
                                View Full Log <i className="ri-arrow-right-line"></i>
                            </button>
                        </div>
                        <div className="bg-white rounded-[2.5rem] border border-[#efedf2] shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-[#fbfbfd] border-b border-[#efedf2]">
                                        <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Date & Time</th>
                                        <th className="px-6 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Distance</th>
                                        <th className="px-6 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Fare</th>
                                        <th className="px-6 py-6 text-[10px] font-black uppercase text-[#7b5900] tracking-widest">Fee (20%)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#efedf2]">
                                    {recentRides.length > 0 ? recentRides.map(ride => (
                                        <tr key={ride._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-black text-gray-900">{new Date(ride.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{new Date(ride.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} • Ride #{ride._id.slice(-4).toUpperCase()}</p>
                                            </td>
                                            <td className="px-6 py-6 text-sm font-bold text-gray-600">{(ride.distance / 1000).toFixed(1)} km</td>
                                            <td className="px-6 py-6 text-sm font-black text-gray-900">₹{(ride.fare || 0).toFixed(2)}</td>
                                            <td className="px-6 py-6 text-sm font-black text-[#7b5900]">₹{((ride.fare || 0) * 0.20).toFixed(2)}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-12 text-center text-gray-400 font-bold">No recent ride activity found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Fleet & Identity Section */}
                    <div className="col-span-4 space-y-8">
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 mb-8">Fleet & Identity</h3>
                            
                            {/* Vehicle Card */}
                            <div className="bg-white p-8 rounded-[2.5rem] border border-[#efedf2] shadow-sm mb-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Vehicle Identifier</p>
                                        <h4 className="text-2xl font-black text-gray-900">{captain.vehicle.plate}</h4>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
                                        <i className="ri-checkbox-circle-fill text-green-500"></i>
                                    </div>
                                </div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{captain.vehicle.color} {captain.vehicle.vehicleType}</p>
                            </div>

                            {/* Featured Document: Driver License */}
                            <div className="bg-white p-6 rounded-[2.5rem] border border-[#efedf2] shadow-sm relative group overflow-hidden">
                                <div className="flex justify-between items-center mb-4 px-2">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Driver's License (Front)</p>
                                    <i className="ri-expand-diagonal-line text-gray-400 group-hover:text-black transition-all cursor-pointer"></i>
                                </div>
                                <div className="aspect-[1.6/1] bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 shadow-inner flex items-center justify-center">
                                    {captain.documents?.licenseFront ? (
                                        <img src={captain.documents.licenseFront} alt="License Front" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-gray-300">
                                            <i className="ri-image-2-line text-4xl"></i>
                                            <span className="text-[10px] font-black uppercase tracking-widest">No Document</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Internal Admin Notes */}
                        <div className="bg-[#f7f4f0] p-8 rounded-[2rem] border border-[#ede9e1]">
                            <div className="flex items-center gap-2 mb-4">
                                <i className="ri-booklet-line text-[#7b5900]"></i>
                                <h5 className="text-[10px] font-black text-[#7b5900] uppercase tracking-widest">Internal Admin Notes</h5>
                            </div>
                            <p className="text-xs font-medium text-[#7b5900]/80 leading-relaxed italic">
                                "Verified high performance during registration. Excellent document clarity and background check cleared."
                            </p>
                            <p className="mt-4 text-[9px] font-black text-[#7b5900]/40 uppercase tracking-widest">
                                — Admin Batch J-902-123
                            </p>
                        </div>

                        <button 
                            onClick={() => setShowAllDocs(true)}
                            className="w-full py-4 bg-white border border-[#efedf2] rounded-2xl text-[10px] font-black text-gray-400 hover:text-black transition-all uppercase tracking-[0.2em] hover:bg-gray-50 active:scale-95"
                        >
                            View All Documents
                        </button>
                    </div>
                </div>
            </main>

            {/* Document Modal (View All Docs) */}
            {showAllDocs && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-12">
                    <div className="bg-white w-full max-w-5xl rounded-[3rem] p-12 relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setShowAllDocs(false)} className="absolute top-8 right-8 w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all text-xl">
                            <i className="ri-close-line"></i>
                        </button>
                        
                        <div className="mb-12">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Vetting Library</h2>
                            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">TX-{captain._id.toUpperCase()}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <DocumentCard label="License Front" src={captain.documents?.licenseFront} />
                            <DocumentCard label="License Back" src={captain.documents?.licenseBack} />
                            <DocumentCard label="Vehicle RC" src={captain.documents?.rc} />
                            <DocumentCard label="Number Plate Photo" src={captain.documents?.numberPlate} />
                            <DocumentCard label="Identity Selfie" src={captain.documents?.selfie} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const NavItem = ({ icon, label, onClick, active }) => (
    <button onClick={onClick} className={`w-full text-left p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 ${active ? 'bg-[#010102] text-white shadow-xl shadow-black/10' : 'text-gray-400 hover:bg-gray-50 hover:text-black'}`}>
        <i className={`${icon} ${active ? 'text-white' : 'text-gray-400'} text-lg`}></i>
        <span className={`font-bold text-sm tracking-tight ${active ? 'text-white' : ''}`}>{label}</span>
    </button>
);

const DocumentCard = ({ label, src }) => (
    <div className="space-y-4">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">{label}</p>
        <div className="aspect-[1.6/1] bg-gray-50 rounded-3xl overflow-hidden border border-[#efedf2] flex items-center justify-center p-4">
            {src ? (
                <img src={src} alt={label} className="w-full h-full object-contain rounded-xl" />
            ) : (
                <div className="flex flex-col items-center gap-2 text-gray-200">
                    <i className="ri-image-2-line text-5xl"></i>
                    <span className="text-xs font-black uppercase tracking-widest">Document Pending</span>
                </div>
            )}
        </div>
    </div>
);

export default AdminCaptainDetails;
