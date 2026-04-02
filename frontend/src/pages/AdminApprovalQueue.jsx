import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logoo.png';
import CaptainDetailModal from '../components/CaptainDetailModal';

const AdminApprovalQueue = () => {
    const [pendingCaptains, setPendingCaptains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCaptain, setSelectedCaptain] = useState(null);
    const navigate = useNavigate();

    const fetchPending = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/captains/pending`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setPendingCaptains(response.data);
        } catch (err) {
            console.error("Error fetching pending captains:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleApprove = async (id) => {
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/captains/approve/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchPending();
            setSelectedCaptain(null);
        } catch (err) {
            console.error("Error approving captain:", err);
        }
    };

    const handleReject = async (id, reason) => {
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/captains/reject/${id}`, { rejectionReason: reason }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchPending();
            setSelectedCaptain(null);
        } catch (err) {
            console.error("Error rejecting captain:", err);
        }
    };

    return (
        <div className="min-h-screen bg-[#fbf8fd] font-['Inter'] flex">
            {/* Sidebar */}
            <div className="w-64 bg-[#efedf2] h-screen fixed left-0 top-0 p-6 flex flex-col border-r border-[#c7c6ca]/20">
                <img src={logo} alt="Logo" className="w-24 mb-12" />
                
                <nav className="flex-1 space-y-2">
                    <button 
                        onClick={() => navigate('/admin/dashboard')}
                        className="w-full text-left p-3 rounded-xl hover:bg-white text-gray-400 hover:text-black flex items-center gap-3 transition-all font-bold text-sm"
                    >
                        <i className="ri-dashboard-line"></i>
                        <span>Overview</span>
                    </button>
                    <button 
                        onClick={() => navigate('/admin/approvals')}
                        className="w-full text-left p-3 rounded-xl bg-[#010102] text-white flex items-center gap-3 shadow-lg shadow-[#010102]/20 transition-all font-bold text-sm"
                    >
                        <i className="ri-user-follow-line"></i>
                        <span>Approvals</span>
                    </button>
                    <button 
                        onClick={() => navigate('/admin/captains')}
                        className="w-full text-left p-3 rounded-xl hover:bg-white text-gray-400 hover:text-black flex items-center gap-3 transition-all font-bold text-sm"
                    >
                        <i className="ri-steering-2-line"></i>
                        <span>Captains</span>
                    </button>
                </nav>

                <div className="mt-auto space-y-4">
                    <button 
                        onClick={async () => {
                            try {
                                await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/logout`, {
                                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                                });
                                localStorage.removeItem('token');
                                navigate('/admin/login');
                            } catch (err) {
                                console.error("Logout failed:", err);
                                localStorage.removeItem('token');
                                navigate('/admin/login');
                            }
                        }}
                        className="w-full text-left p-3 rounded-xl hover:bg-red-50 text-gray-500 hover:text-red-600 flex items-center gap-3 transition-all group"
                    >
                        <i className="ri-logout-box-line group-hover:rotate-12 transition-transform"></i>
                        <span className="font-medium text-sm">Sign Out</span>
                    </button>

                    <div className="pt-6 border-t border-[#c7c6ca]/20">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            Fleet Vetting Protocol
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-12">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <h4 className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">Queue Management</h4>
                        <h1 className="text-4xl font-bold text-[#010102]">Approval Queue</h1>
                        <div className="h-0.5 w-12 bg-[#7b5900] mt-3"></div>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#efedf2] shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-[#7b5900] animate-pulse"></div>
                        <span className="text-xs font-bold text-[#46464a]">{pendingCaptains.length} APPLICATIONS</span>
                    </div>
                </header>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                         <div className="animate-spin h-8 w-8 border-4 border-[#7b5900] border-t-transparent rounded-full"></div>
                    </div>
                ) : pendingCaptains.length === 0 ? (
                    <div className="bg-white p-20 rounded-[3rem] text-center border border-[#efedf2] shadow-[0_20px_100px_rgba(0,0,0,0.02)]">
                        <div className="w-16 h-16 bg-[#fbf8fd] mx-auto mb-6 rounded-full flex items-center justify-center text-gray-300">
                             <i className="ri-inbox-archive-line text-2xl"></i>
                        </div>
                        <h3 className="text-xl font-bold text-[#010102] mb-2">Queue Clear</h3>
                        <p className="text-gray-400 text-sm">No pending applications at this moment.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-[3rem] shadow-[0_20px_100px_rgba(0,0,0,0.03)] border border-[#efedf2] overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-[#fbf8fd] border-b border-[#efedf2]">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Captain</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vehicle</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Documents</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#efedf2]">
                                {pendingCaptains.map((captain) => (
                                    <tr key={captain._id} className="group hover:bg-[#fbf8fd] transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[#efedf2] rounded-full flex items-center justify-center font-bold text-[#010102]">
                                                    {captain.fullname.firstname[0]}
                                                </div>
                                                <div className="font-bold text-[#010102]">{captain.fullname.firstname} {captain.fullname.lastname}</div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-medium text-[#46464a]">{captain.vehicle.vehicleType}</div>
                                            <div className="text-[10px] text-gray-400 uppercase ">{captain.vehicle.plate}</div>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-[#46464a]">{captain.email}</td>
                                        <td className="px-8 py-6">
                                            <div className="flex -space-x-2">
                                                {captain.documents.length > 0 ? (
                                                    captain.documents.map((doc, i) => (
                                                        <div key={i} className="w-7 h-7 bg-white border-2 border-[#fbf8fd] rounded-lg shadow-sm flex items-center justify-center overflow-hidden">
                                                            <i className="ri-file-text-line text-[#7b5900] text-xs"></i>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-[10px] text-gray-400 italic">No docs uploaded</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button 
                                                onClick={() => setSelectedCaptain(captain)}
                                                className="px-6 py-2.5 bg-[#010102] text-white text-xs font-bold rounded-xl hover:scale-105 transition-all shadow-md shadow-[#010102]/10"
                                            >
                                                REVIEW
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {selectedCaptain && (
                    <CaptainDetailModal 
                        captain={selectedCaptain} 
                        onClose={() => setSelectedCaptain(null)} 
                        onApprove={handleApprove}
                        onReject={handleReject}
                    />
                )}
            </main>
        </div>
    );
};

export default AdminApprovalQueue;
