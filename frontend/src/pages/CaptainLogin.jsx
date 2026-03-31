import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { CaptainDataContext } from '../context/CaptainContext';
import axios from 'axios';
import logo from '../assets/logoo.png';
import PasswordResetPanel from "../components/PasswordResetPanel";

const CaptainLogin = ({ resetPanelOpen, setResetPanelOpen }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const captainData={
      email: email,
      password: password
    }

    try {
      // const response = await axios.post(
      //   `${import.meta.env.VITE_BASE_URL}/captains/login`,
      //   { email, password }
      // );
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captainData, {
        withCredentials: true, // Ensure cookies are sent if required for authentication
      });

      console.log('response', response);

      if (response.status === 200) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem('token', data.token);
        toast.success('✅ Successfully Logged In!', {
          position: 'top-right',
          autoClose: 1000,
        });
        
        if (data.captain.status === 'approved') {
          navigate('/captain-home');
        } else {
          navigate('/captain-status');
        }
      }
    } catch (error) {
      toast.error('❌ Login failed. Check your credentials!', {
        position: 'top-right',
        autoClose: 2000,
      });
      console.error("Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-start mb-6 ">
          <img
            className="mx-auto h-14 w-auto sm:h-16 object-contain"
            src={logo}
            alt="TravelX Logo"
          />
        </div>

        {/* Card */}
        <div className="mt-6 sm:mt-8 bg-white py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-gray-100">
          <form className="space-y-6" onSubmit={submitHandler}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-all outline-none"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-all outline-none pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => setResetPanelOpen(true)}
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 transition-colors"
              >
                Login
              </button>
            </div>

            {/* Register link */}
            <div className="text-center text-sm">
              <p className="text-gray-600">
                Join a fleet?{' '}
                <Link
                  to="/captain-signup"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Register as a Captain
                </Link>
              </p>
            </div>
          </form>

          {/* Sign in as User */}
          <div className="mt-8">
            <Link
              to="/login"
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              Sign in as User
            </Link>
          </div>

          {/* Sign in as Admin */}
          <div className="mt-4">
            <Link
              to="/admin/login"
              className="w-full flex items-center justify-center py-3 px-4 border border-black rounded-lg shadow-sm text-base font-medium text-black bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
            >
              Sign in as Admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CaptainLoginWrapper = () => {
  const [resetPanelOpen, setResetPanelOpen] = useState(false);

  return (
    <>
      <CaptainLogin
        resetPanelOpen={resetPanelOpen}
        setResetPanelOpen={setResetPanelOpen}
      />
      {resetPanelOpen && (
        <PasswordResetPanel
          basePath="captains"
          accountType="Captain"
          onClose={() => setResetPanelOpen(false)}
          onSuccess={() => toast.success("Password updated")}
        />
      )}
    </>
  );
};

// export default CaptainLogin;
export default CaptainLoginWrapper;
