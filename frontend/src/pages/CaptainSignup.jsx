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
    <div className="py-5 px-5 h-screen flex flex-col justify-between bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} /> {/* ✅ Toast Container */}
      
      <div>
         <img className="w-21 h-20 mb-2" src={logo} alt="Logo" />

        <form onSubmit={submitHandler} className="bg-white p-5 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-2">What's our Captain's name</h3>
          <div className="flex gap-4 mb-7">
            <input required className="bg-gray-200 w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              type="text" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <input required className="bg-gray-200 w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              type="text" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>

          <h3 className="text-lg font-medium mb-1">What's our Captain's email</h3>
          <input required className="bg-gray-200 mb-5 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
            type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />

          <h3 className="text-lg font-medium mb-1">Enter Password</h3>
          <div className="relative mb-3">
            <input required className="bg-gray-200 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base pr-10"
              type={showPassword ? "text" : "password"} placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" className="absolute right-3 top-3 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <h3 className="text-lg font-medium mb-2">Vehicle Information</h3>
          <div className="flex gap-4 mb-7">
            <input required className="bg-gray-200 w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              type="text" placeholder="Vehicle Color" value={vehicleColor} onChange={(e) => setVehicleColor(e.target.value)} />
            <input required className="bg-gray-200 w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              type="text" placeholder="Vehicle Plate" value={vehiclePlate} onChange={(e) => setVehiclePlate(e.target.value)} />
          </div>

          <div className="flex gap-4 mb-7">
            <input required className="bg-gray-200 w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              type="number" placeholder="Vehicle Capacity" value={vehicleCapacity} onChange={(e) => setVehicleCapacity(e.target.value)} />
            <select required className="bg-gray-200 w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
              <option value="" disabled>Select Vehicle Type</option>
              <option value="car">Car</option>
              <option value="auto">Auto</option>
              <option value="motorcycle">Moto</option>
            </select>
          </div>

          <button className="bg-black text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg" type="submit">
            Create Captain Account
          </button>
        </form>

        <p className="text-center">Already have an account?{" "}
          <Link to="/captain-login" className="text-blue-600">Login here</Link>
        </p>
      </div>

      <div>
        <p className="text-xs mt-6 leading-tight">
          This site is protected by reCAPTCHA and the{" "}
          <span className="underline">Google Privacy Policy</span> and{" "}
          <span className="underline">Terms of Service apply</span>.
        </p>
      </div>
    </div>
  );
};

export default CaptainSignup;
