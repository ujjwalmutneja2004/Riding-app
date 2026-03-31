import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import logo from '../assets/logoo.png';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/login`, {
                email,
                password
            }, { withCredentials: true });

            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                toast.success('✅ Admin Authenticated');
                navigate('/admin/dashboard');
            }
        } catch (err) {
            toast.error('❌ Authentication Failed');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-[#fbf8fd] flex flex-col justify-center py-12 px-6 lg:px-8 font-['Inter'] relative">
            <button 
                onClick={() => navigate('/')}
                className="absolute top-10 left-10 flex items-center gap-2 text-gray-400 hover:text-[#010102] transition-all font-medium uppercase tracking-widest text-[10px]"
            >
                <i className="ri-arrow-left-line text-lg"></i>
                Back Home
            </button>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <img className="mx-auto h-16 w-auto mb-8" src={logo} alt="TravelX Admin" />
                
                <div className="bg-white py-10 px-8 shadow-[0_20px_100px_rgba(0,0,0,0.05)] rounded-[2.5rem] border border-[#efedf2]">
                    <div className="mb-8">
                        <h4 className="text-[10px] font-bold text-[#7b5900] uppercase tracking-widest mb-1">Secure Gateway</h4>
                        <h2 className="text-3xl font-bold text-[#010102] tracking-tight">Admin Login</h2>
                        <div className="h-1 w-8 bg-[#010102] mt-3"></div>
                    </div>

                    <form className="space-y-6" onSubmit={submitHandler}>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Administrative Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full px-5 py-4 bg-[#fbf8fd] border border-[#efedf2] rounded-2xl text-[#010102] focus:ring-2 focus:ring-[#010102] focus:border-transparent outline-none transition-all placeholder:text-gray-300"
                                placeholder="admin@travelx.com"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Access Key</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full px-5 py-4 bg-[#fbf8fd] border border-[#efedf2] rounded-2xl text-[#010102] focus:ring-2 focus:ring-[#010102] focus:border-transparent outline-none transition-all placeholder:text-gray-300"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-[#010102] text-white rounded-2xl font-bold shadow-xl hover:bg-[#1c1c1e] transform active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <i className="ri-shield-user-line"></i>
                            AUTHENTICATE
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-center text-[10px] text-gray-400 uppercase tracking-[0.2em]">
                    Restricted Access • Precision Navigator OS
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
