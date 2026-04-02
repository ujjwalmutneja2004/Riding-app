import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import logo from '../assets/logoo.png';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        active: 0
    });
    const [companyWallet, setCompanyWallet] = useState({ totalBalance: 0, totalCommissionEarned: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [statsRes, walletRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_BASE_URL}/admin/stats`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    }),
                    axios.get(`${import.meta.env.VITE_BASE_URL}/admin/company-balance`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    })
                ]);
                setStats(statsRes.data);
                setCompanyWallet(walletRes.data);
            } catch (err) {
                console.error("Error fetching admin data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const chartData = [
        { name: 'Pending', count: stats.pending },
        { name: 'Approved', count: stats.approved },
        { name: 'Rejected', count: stats.rejected },
    ];

    return (
        <div className="min-h-screen bg-[#fbf8fd] font-['Inter'] flex">
            {/* Sidebar */}
            <div className="w-64 bg-[#efedf2] h-screen fixed left-0 top-0 p-6 flex flex-col border-r border-[#c7c6ca]/20">
                <img src={logo} alt="Logo" className="w-24 mb-12" />
                
                <nav className="flex-1 space-y-2">
                    <button 
                        onClick={() => navigate('/admin/dashboard')}
                        className="w-full text-left p-3 rounded-xl bg-[#010102] text-white flex items-center gap-3 shadow-lg shadow-[#010102]/20 transition-all font-bold text-sm"
                    >
                        <i className="ri-dashboard-line"></i>
                        <span>Overview</span>
                    </button>
                    <button 
                        onClick={() => navigate('/admin/approvals')}
                        className="w-full text-left p-3 rounded-xl hover:bg-white text-gray-400 hover:text-black flex items-center gap-3 transition-all font-bold text-sm"
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
                            TravelX Control System
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-12">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <h4 className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">Systems Oversight</h4>
                        <h1 className="text-4xl font-bold text-[#010102]">Executive Dashboard</h1>
                        <div className="h-0.5 w-12 bg-[#7b5900] mt-3"></div>
                    </div>
                </header>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin h-8 w-8 border-4 border-[#7b5900] border-t-transparent rounded-full"></div>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-4 gap-6">
                            <StatCard label="TravelX Balance" value={`₹${companyWallet.totalBalance.toFixed(2)}`} color="bg-[#7b5900]" textColor="text-white" highlight />
                            <StatCard label="Total Fleet" value={stats.total} color="bg-[#010102]" textColor="text-white" />
                            <StatCard label="Pending" value={stats.pending} subText="Pending Review" />
                            <StatCard label="Approved" value={stats.approved} />
                        </div>

                        <div className="grid grid-cols-3 gap-10">
                            {/* Distribution Chart */}
                            <div className="col-span-2 bg-white p-10 rounded-[2rem] shadow-[0_20px_100px_rgba(0,0,0,0.03)] border border-[#efedf2]">
                                <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
                                    Fleet Distribution
                                    <span className="px-2 py-0.5 bg-[#fbf8fd] text-[10px] rounded-full text-gray-400">REALTIME</span>
                                </h3>
                                <div className="h-80 w-full font-['Inter']">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#46464a', fontSize: 11}} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#46464a', fontSize: 11}} />
                                            <Tooltip cursor={{fill: '#f5f3f8'}} contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}} />
                                            <Bar dataKey="count" fill="#010102" radius={[12, 12, 4, 4]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Action Card */}
                            <div className="bg-gradient-to-br from-[#010102] to-[#1c1c1e] p-10 rounded-[2rem] text-white flex flex-col justify-between shadow-2xl shadow-[#010102]/30">
                                <div>
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                                        <i className="ri-notification-3-line text-[#7b5900] text-xl"></i>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">Pending Approvals</h3>
                                    <p className="text-white/60 text-sm leading-relaxed mb-6">
                                        There are {stats.pending} captain applications waiting for your review. Precision in vetting ensures platform safety.
                                    </p>
                                </div>
                                <button 
                                    onClick={() => navigate('/admin/approvals')}
                                    className="w-full py-4 bg-[#7b5900] text-white rounded-2xl font-bold hover:scale-[1.02] transition-transform active:scale-95"
                                >
                                    Review Now
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

const StatCard = ({ label, value, subText, highlight, color = "bg-white", textColor = "text-[#010102]" }) => (
    <div className={`${color} p-8 rounded-[2rem] shadow-[0_10px_50px_rgba(0,0,0,0.02)] border border-[#efedf2] group transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)]`}>
        <div className="flex justify-between items-start mb-4">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${textColor === 'text-white' ? 'text-white/50' : 'text-gray-400'}`}>
                {label}
            </span>
            {highlight && <div className="w-2 h-2 rounded-full bg-[#7b5900] animate-pulse"></div>}
        </div>
        <div className={`text-5xl font-bold ${textColor} tracking-tight mb-2`}>{value}</div>
        {subText && <p className="text-[10px] text-gray-400 font-medium">{subText}</p>}
    </div>
);

export default AdminDashboard;
