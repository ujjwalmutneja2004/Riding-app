import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { CaptainDataContext } from '../context/CaptainContext';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'; // ✅ Toast Import
import 'react-toastify/dist/ReactToastify.css'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // ✅ Eye Icon Import
import logo from '../assets/logoo.png';

const CaptainSignup = () => {
  const navigate = useNavigate();
  const { setCaptain } = useContext(CaptainDataContext);

  // State variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ Password Toggle
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    const captainData = {
      fullname: { firstname: firstName, lastname: lastName },
      email,
      password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: Number(vehicleCapacity), // ✅ Ensure it's a number
        vehicleType,
      },
    };

    console.log("Submitting Captain Data:", captainData);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/register`,
        captainData
      );

      console.log("Success:", response.data);
      if (response.status === 201) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem("token", data.token);
        toast.success("Captain Account Created Successfully! ✅"); // ✅ Toast Success
        setTimeout(() => navigate("/captain-home"), 2000); // ✅ Navigate after 2 sec
      }

      // Reset form fields
      setEmail(""); setFirstName(""); setLastName(""); setPassword("");
      setVehicleColor(""); setVehiclePlate(""); setVehicleCapacity(""); setVehicleType("");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong! ❌"); // ✅ Toast Error
    }
  };

  return (
   <div className="min-h-screen bg-gray-50 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-5xl xl:max-w-6xl">
        {/* Smaller logo */}
        <div className="text-center mb-5">
          <img
            className="mx-auto h-10 w-auto sm:h-12 object-contain"
            src={logo}
            alt="TravelX Logo"
          />
        </div>

        <div className="bg-white py-6 px-6 sm:px-8 lg:px-10 shadow-xl rounded-2xl border border-gray-200">
          <form onSubmit={submitHandler} className="space-y-5">
            {/* Name fields - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  First name
                </label>
                <input
                  required
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-base placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Last name
                </label>
                <input
                  required
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-base placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-all outline-none"
                />
              </div>
            </div>

            {/* Email + Password - side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <input
                  required
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-base placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-base placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-all outline-none pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash size={18} />
                    ) : (
                      <FaEye size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Vehicle info - 4 columns on wide screens */}
            <div className="pt-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Vehicle Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Color
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Vehicle color"
                    value={vehicleColor}
                    onChange={(e) => setVehicleColor(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-base placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Plate
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. PB10AB1234"
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-base placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Capacity
                  </label>
                  <input
                    required
                    type="number"
                    placeholder="Persons"
                    value={vehicleCapacity}
                    onChange={(e) => setVehicleCapacity(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-base placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Type
                  </label>
                  <select
                    required
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-base text-gray-700 focus:border-black focus:ring-1 focus:ring-black transition-all outline-none"
                  >
                    <option value="" disabled>
                      Select type
                    </option>
                    <option value="car">Car</option>
                    <option value="auto">Auto</option>
                    <option value="motorcycle">Motorcycle</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Button & link */}
            <div className="pt-5 flex justify-center">
              <div className="flex-row items-center gap-6 sm:gap-10">
                <button
                  type="submit"
                  className="bg-black text-white font-semibold py-3 px-8 rounded-lg text-base hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all shadow-md min-w-[220px] sm:min-w-[260px]"
                >
                  Create Captain Account
                </button>

                <p className="text-sm text-gray-600 whitespace-nowrap mt-4 text-center">
                  Already have an account?{" "}
                  <Link
                    to="/captain-login"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-gray-500">
            This site is protected by reCAPTCHA and the Google Privacy Policy
            and Terms of Service apply.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaptainSignup;
