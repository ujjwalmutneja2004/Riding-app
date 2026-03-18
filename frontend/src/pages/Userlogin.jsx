import React, { useState ,useContext} from 'react'
import { Link } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';  // Import eye icons
import logo from '../assets/logoo.png'
import PasswordResetPanel from "../components/PasswordResetPanel";

export const Userlogin = ({ resetPanelOpen, setResetPanelOpen }) => {
  //two way binding
  //so that react ko pata lage ky kar rhe ho
  const [email, setEmail] = useState('');
  const [password,setpassword] = useState('');
  // const[userData,setUserData] = useState({});
    const [showPassword, setShowPassword] = useState(false); // 🔹 Toggle state

  const {user,setUser}=useContext(UserDataContext);
  const navigate=useNavigate();


  const submitHandler = async(e) => {
    e.preventDefault(); //default behaviour of form is to refresh the page
    
    const userData={
      email: email,
      password: password
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData, {
        withCredentials: true, // Ensure cookies are sent if required for authentication
      });

      if (response.status === 200) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem('token',data.token)
        toast.success('✅ Successfully Logged In!', { position: 'top-right', autoClose: 3000 });
        
        // Clear form fields after successful login
        // setEmail('');
        // setPassword('');
        
        navigate('/home');
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="text-center">
          <img
            className="mx-auto h-14 w-auto sm:h-16 object-contain"
            src={logo}
            alt="TravelX Logo"
          />
        </div>

        {/* Card */}
        <div className="mt-8 bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
          <form className="space-y-6" onSubmit={submitHandler}>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
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
            <div className="mt-1 relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-all outline-none pr-10"
                placeholder="••••••••"
              />

              {/* FIXED BUTTON */}
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
                )}
              </button>
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

            {/* Login Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 transition-all"
              >
                Sign in
              </button>
            </div>

            {/* Create account link */}
            <div className="text-center text-sm">
              <p className="text-gray-600">
                New here?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Create new account
                </Link>
              </p>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Bottom buttons */}
            <div className="mt-6 space-y-4">
              {/* Google Sign In */}
              <button
                onClick={() => {
                  window.location.assign(
                    `${import.meta.env.VITE_BASE_URL}/auth/google`,
                  );
                }}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              >
                <img
                  src="https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png"
                  alt="Google"
                  className="h-5 w-5"
                />
                Sign in with Google
              </button>

              {/* Captain Login */}
              <Link
                to="/captain-login"
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
              >
                Sign in as Captain
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const UserloginWrapper = () => {
  const [resetPanelOpen, setResetPanelOpen] = useState(false);

  return (
    <>
      <Userlogin
        resetPanelOpen={resetPanelOpen}
        setResetPanelOpen={setResetPanelOpen}
      />
      {resetPanelOpen && (
        <PasswordResetPanel
          basePath="users"
          accountType="User"
          onClose={() => setResetPanelOpen(false)}
          onSuccess={() => toast.success("Password updated")}
        />
      )}
    </>
  );
};

export default UserloginWrapper;
