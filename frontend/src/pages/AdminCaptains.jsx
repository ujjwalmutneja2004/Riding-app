import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logoo.png';

const AdminCaptains = () => {
    const [data, setData] = useState({
        aggregateOversight: 0,
        activeCaptainsCount: 0,
        fleet: []
    });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All Records');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const navigate = useNavigate();

    const fetchFleetData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/fleet-stats`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setData(response.data);
        } catch (err) {
            console.error("Error fetching fleet data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFleetData();
    }, []);

    useEffect(() => {
        setCurrentPage(1); // Reset page when filter changes
    }, [filter]);

    const handleExportCSV = () => {
        const headers = ["Captain Name,Email,Rides,Gross Earnings,Platform Fee,Net Payout,Status\n"];
        const rows = data.fleet.map(c => 
            `"${c.fullname.firstname} ${c.fullname.lastname}",${c.email},${c.rides},${c.grossEarnings},${c.platformFee},${c.netPayout},${c.status === 'approved' ? 'ONLINE' : 'OFFLINE'}`
        ).join("\n");
        
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `TravelX_Fleet_Report_${new Date().toLocaleDateString()}.csv`;
        a.click();
    };

    const filteredFleet = data.fleet.filter(captain => {
        if (filter === 'Online') return captain.isAvailable === true;
        if (filter === 'Rejected') return captain.status === 'rejected';
        return true;
    });

    const totalPages = Math.ceil(filteredFleet.length / itemsPerPage);
    const paginatedFleet = filteredFleet.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleLogout = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/logout`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            localStorage.removeItem('token');
            navigate('/admin/login');
        } catch (err) {
            localStorage.removeItem('token');
            navigate('/admin/login');
        }
    };

    return (
        <div className="min-h-screen bg-[#fbf8fd] font-['Inter'] flex">
            {/* Sidebar - Replicated exactly from screenshot */}
            <div className="w-64 bg-white h-screen fixed left-0 top-0 p-8 flex flex-col border-r border-[#efedf2] z-20">
                <div className="mb-12">
                    <img src={logo} alt="Logo" className="w-24 mb-2" />
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">TravelX Admin</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Editorial Oversight</p>
                </div>
                
                <nav className="flex-1 space-y-1">
                    <NavItem icon="ri-dashboard-line" label="Dashboard" onClick={() => navigate('/admin/dashboard')} />
                    <NavItem icon="ri-user-follow-line" label="Captain Approvals" onClick={() => navigate('/admin/approvals')} />
                    <NavItem icon="ri-steering-2-line" label="Captains" active />
                </nav>

                <div className="mt-auto space-y-6">
                    <button 
                        onClick={handleLogout}
                        className="w-full text-left p-3 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-600 flex items-center gap-3 transition-all"
                    >
                        <i className="ri-logout-box-line"></i>
                        <span className="font-bold text-sm">Sign Out</span>
                    </button>
                    
                    <div className="pt-6 border-t border-[#efedf2]">
                        <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.2em]">TravelX Systems v1.0</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-12 bg-[#fbf8fd]">
                <header className="mb-12 flex justify-between items-center">
                    <div className="relative w-96">
                        <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <input 
                            type="text" 
                            placeholder="Search fleet records..." 
                            className="w-full bg-[#efedf2] border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-black/5 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-8">
                         <div className="flex gap-4">
                            <i className="ri-notification-3-line text-xl text-gray-400"></i>
                            <i className="ri-question-line text-xl text-gray-400"></i>
                         </div>
                         <div className="flex items-center gap-3 pl-8 border-l border-[#efedf2]">
                            <div className="text-right">
                                <p className="text-sm font-black text-gray-900">Admin Control</p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Super Admin</p>
                            </div>
                            <div className="w-10 h-10 bg-gray-200 rounded-full border-2 border-white shadow-sm overflow-hidden">
                                <img src="https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg" alt="Profile" className="w-full h-full object-cover" />
                            </div>
                         </div>
                    </div>
                </header>

                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full"></div>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {/* Upper Stats */}
                        <div className="grid grid-cols-12 gap-8">
                            <div className="col-span-8 bg-gradient-to-br from-[#010102] to-[#1c1c1e] p-12 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#7b5900]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                                <div className="relative z-10">
                                    <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Aggregate Oversight</h5>
                                    <div className="flex items-baseline gap-4 mb-8">
                                        <h2 className="text-6xl font-black tracking-tighter">₹{data.aggregateOversight.toFixed(2)}</h2>
                                        <span className="text-green-400 text-sm font-bold flex items-center gap-1">
                                            <i className="ri-arrow-right-up-line"></i> +12.4%
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-xs font-medium max-w-sm leading-relaxed">
                                        Total Platform Commission generated from 20% flat-fee logistics mediation since fiscal inception.
                                    </p>
                                </div>
                            </div>

                            <div className="col-span-4 flex flex-col gap-6">
                                <div className="bg-white p-8 rounded-[2.5rem] border border-[#efedf2] shadow-sm flex flex-col justify-between h-full">
                                    <div>
                                        <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Active Captains</h5>
                                        <h3 className="text-4xl font-black text-gray-900">{data.activeCaptainsCount}</h3>
                                    </div>
                                    <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#7b5900] w-[70%]" />
                                    </div>
                                </div>
                                <div className="bg-white p-8 rounded-[2.5rem] border border-[#efedf2] shadow-sm flex flex-col justify-between h-full">
                                    <div>
                                        <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Avg. Daily Payout</h5>
                                        <h3 className="text-4xl font-black text-gray-900">₹{(data.aggregateOversight / 30).toFixed(0)}</h3>
                                    </div>
                                    <p className="text-[10px] font-bold text-green-500 uppercase flex items-center gap-1 mt-2">
                                        <i className="ri-flashlight-fill"></i> Optimized Flow
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Fleet Management Table */}
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Fleet Management <span className="text-[#7b5900]">——</span></h3>
                                </div>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={handleExportCSV}
                                        className="px-6 py-2.5 bg-white border border-[#efedf2] rounded-2xl text-xs font-bold text-gray-400 hover:text-black transition-all hover:bg-gray-50 active:scale-95"
                                    >
                                        Export CSV
                                    </button>
                                    <button className="px-6 py-2.5 bg-black text-white rounded-2xl text-xs font-bold shadow-lg shadow-black/10 flex items-center gap-2">
                                        <i className="ri-filter-3-line"></i> Advanced Filters
                                    </button>
                                </div>
                            </div>

                            {/* Filters/Tabs */}
                            <div className="flex items-center gap-8 mb-8 pb-4 border-b border-[#efedf2]">
                                <div className="flex gap-6">
                                    <TabItem label="All Records" active={filter === 'All Records'} onClick={() => setFilter('All Records')} />
                                    <TabItem label="Online" active={filter === 'Online'} onClick={() => setFilter('Online')} />
                                    <TabItem label="Rejected" active={filter === 'Rejected'} onClick={() => setFilter('Rejected')} />
                                </div>
                                <div className="flex items-center gap-2 bg-[#efedf2] px-4 py-2 rounded-xl">
                                    <i className="ri-calendar-event-line text-gray-400"></i>
                                    <span className="text-[11px] font-bold text-gray-600">Last 30 Days</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-[2.5rem] border border-[#efedf2] shadow-sm overflow-hidden overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-[#fbfbfd] border-b border-[#efedf2]">
                                            <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Captain Identity</th>
                                            <th className="px-6 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Rides</th>
                                            <th className="px-6 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Gross Earnings</th>
                                            <th className="px-6 py-6 text-[10px] font-black uppercase text-gray-700 tracking-widest bg-[#f7f4f0]">Platform Fee (20%)</th>
                                            <th className="px-6 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Net Payout</th>
                                            <th className="px-6 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Performance</th>
                                            <th className="px-6 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right pr-12">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#efedf2]">
                                        {paginatedFleet.map((captain) => (
                                            <tr 
                                                key={captain.id} 
                                                onClick={() => navigate(`/admin/captain/${captain.id}`)}
                                                className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                                                            <img src="https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg" alt="Capt" className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-gray-900 tracking-tight leading-none mb-1">{captain.fullname.firstname} {captain.fullname.lastname}</p>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">ID: TX-{captain.id.slice(-4).toUpperCase()}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 text-sm font-bold text-gray-600">{captain.rides}</td>
                                                <td className="px-6 py-6 text-sm font-black text-gray-900">₹{captain.grossEarnings.toFixed(2)}</td>
                                                <td className="px-6 py-6 text-sm font-black text-[#7b5900] bg-[#f7f4f0]/50 group-hover:bg-[#f7f4f0] transition-colors">₹{captain.platformFee.toFixed(2)}</td>
                                                <td className="px-6 py-6 text-sm font-black text-gray-900">₹{captain.netPayout.toFixed(2)}</td>
                                                <td className="px-6 py-6 text-center">
                                                    <div className="flex items-center justify-center gap-1 px-3 py-1 bg-yellow-50 rounded-full inline-flex border border-yellow-100">
                                                        <i className="ri-star-fill text-yellow-500 text-[10px]"></i>
                                                        <span className="text-[11px] font-black text-yellow-700">{captain.performance.toFixed(2)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 text-right pr-12">
                                                    <span className={`text-[9px] font-black px-3 py-1 rounded-full border tracking-widest ${captain.isAvailable ? 'bg-green-50 text-green-600 border-green-100' : (captain.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-50 text-gray-600 border-gray-100')}`}>
                                                        {captain.isAvailable ? 'ONLINE' : (captain.status === 'rejected' ? 'REJECTED' : 'OFFLINE')}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Pagination UI */}
                                {totalPages > 1 && (
                                    <div className="px-8 py-4 bg-[#fbfbfd] border-t border-[#efedf2] flex items-center justify-between">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            Page {currentPage} of {totalPages}
                                        </p>
                                        <div className="flex gap-2">
                                            <button 
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage(prev => prev - 1)}
                                                className="px-4 py-2 bg-white border border-[#efedf2] rounded-xl text-[10px] font-bold text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                            >
                                                PREVIOUS
                                            </button>
                                            <button 
                                                disabled={currentPage === totalPages}
                                                onClick={() => setCurrentPage(prev => prev + 1)}
                                                className="px-4 py-2 bg-white border border-[#efedf2] rounded-xl text-[10px] font-bold text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                            >
                                                NEXT
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

const NavItem = ({ icon, label, onClick, active, disabled }) => (
    <button 
        disabled={disabled}
        onClick={onClick}
        className={`w-full text-left p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 ${active ? 'bg-[#010102] text-white shadow-xl shadow-black/10' : 'text-gray-400 hover:bg-gray-50 hover:text-black'} ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
    >
        <i className={`${icon} ${active ? 'text-white' : 'text-gray-400 group-hover:text-black'} text-lg`}></i>
        <span className={`font-bold text-sm tracking-tight ${active ? 'text-white' : ''}`}>{label}</span>
        {active && <div className="ml-auto w-1 h-1 bg-white rounded-full"></div>}
    </button>
);

const TabItem = ({ label, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`text-xs font-bold tracking-tight pb-2 relative transition-all ${active ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}>
        {label}
        {active && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#7b5900]"></div>}
    </button>
);

export default AdminCaptains;
