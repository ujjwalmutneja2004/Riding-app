import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { CaptainDataContext } from '../context/CaptainContext';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { FaEye, FaEyeSlash, FaCloudUploadAlt, FaCheckCircle, FaTrash } from 'react-icons/fa';
import logo from '../assets/logoo.png';

const CaptainSignup = () => {
  const navigate = useNavigate();
  const { setCaptain } = useContext(CaptainDataContext);

  // Form Steps
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1 States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  // Step 2 States (Files)
  const [files, setFiles] = useState({
    licenseFront: null,
    licenseBack: null,
    selfie: null,
    numberPlate: null,
    rc: null
  });

  const [previews, setPreviews] = useState({
    licenseFront: null,
    licenseBack: null,
    selfie: null,
    numberPlate: null,
    rc: null
  });

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
      setPreviews(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  const removeFile = (type) => {
    setFiles(prev => ({ ...prev, [type]: null }));
    setPreviews(prev => ({ ...prev, [type]: null }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    // Check if all files are selected in step 2
    const missingDocs = Object.keys(files).filter(key => !files[key]);
    if (missingDocs.length > 0) {
      toast.error("Please upload all verification documents! ❌");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    
    // Nesting for express-validator
    formData.append('fullname[firstname]', firstName);
    formData.append('fullname[lastname]', lastName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('vehicle[color]', vehicleColor);
    formData.append('vehicle[plate]', vehiclePlate);
    formData.append('vehicle[capacity]', vehicleCapacity);
    formData.append('vehicle[vehicleType]', vehicleType);

    // Append Files
    Object.keys(files).forEach(key => {
      formData.append(key, files[key]);
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/register`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.status === 201) {
        setCaptain(response.data.captain);
        localStorage.setItem("token", response.data.token);
        toast.success("Account Created! Vetting in progress... ⏳");
        setTimeout(() => navigate("/captain-status"), 2000);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Upload failed. Try again! ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf8fd] flex flex-col items-center py-12 px-4 font-['Inter']">
      <ToastContainer position="top-center" autoClose={3000} />
      
      <img className="h-10 mb-8 sm:h-12" src={logo} alt="Logo" />

      {/* Progress Stepper */}
      <div className="w-full max-w-lg mb-10 flex items-center justify-center gap-4">
        <div className={`flex items-center gap-2 ${step === 1 ? 'text-[#010102]' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 1 ? 'bg-[#010102] text-white shadow-lg' : 'bg-gray-200'}`}>1</div>
          <span className="text-sm font-bold">Details</span>
        </div>
        <div className="w-12 h-0.5 bg-gray-200"></div>
        <div className={`flex items-center gap-2 ${step === 2 ? 'text-[#010102]' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 2 ? 'bg-[#010102] text-white shadow-lg' : 'bg-gray-200'}`}>2</div>
          <span className="text-sm font-bold">Verification</span>
        </div>
      </div>

      <div className="w-full max-w-3xl bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-[0_20px_100px_rgba(0,0,0,0.03)] border border-[#efedf2]">
        {step === 1 ? (
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="First Name" value={firstName} onChange={setFirstName} placeholder="John" />
              <Input label="Last Name" value={lastName} onChange={setLastName} placeholder="Doe" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Email address" type="email" value={email} onChange={setEmail} placeholder="john@example.com" />
              <div className="relative">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
                <div className="relative">
                  <input required type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-[#efedf2] bg-[#fbf8fd] px-5 py-3.5 text-sm outline-none focus:border-[#010102] transition-all" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#7b5900] mb-6">Fleet Information</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Input label="Color" value={vehicleColor} onChange={setVehicleColor} placeholder="Black" />
                <Input label="Plate" value={vehiclePlate} onChange={setVehiclePlate} placeholder="PB10..." />
                <Input label="Capacity" type="number" value={vehicleCapacity} onChange={setVehicleCapacity} placeholder="4" />
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Type</label>
                  <select required value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} className="w-full rounded-xl border border-[#efedf2] bg-[#fbf8fd] px-5 py-3.5 text-sm font-medium outline-none focus:border-[#010102] transition-all appearance-none cursor-pointer">
                    <option value="" disabled>Select</option>
                    <option value="car">Car</option>
                    <option value="auto">Auto</option>
                    <option value="motorcycle">Bike</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-4 mt-8 bg-[#010102] text-white rounded-2xl font-bold shadow-xl hover:scale-[1.01] transition-all">
              Continue to Verification
            </button>
          </form>
        ) : (
          <form className="space-y-10" onSubmit={submitHandler}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <UploadCard label="License (Front)" type="licenseFront" preview={previews.licenseFront} onChange={handleFileChange} onRemove={removeFile} />
              <UploadCard label="License (Back)" type="licenseBack" preview={previews.licenseBack} onChange={handleFileChange} onRemove={removeFile} />
              <UploadCard label="Vehicle RC" type="rc" preview={previews.rc} onChange={handleFileChange} onRemove={removeFile} />
              <UploadCard label="Number Plate" type="numberPlate" preview={previews.numberPlate} onChange={handleFileChange} onRemove={removeFile} />
              <UploadCard label="Driver Selfie" type="selfie" preview={previews.selfie} onChange={handleFileChange} onRemove={removeFile} full />
            </div>

            <div className="flex gap-4 pt-10 border-t border-[#efedf2]">
              <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 text-gray-400 font-bold hover:text-black transition-all">Back to Details</button>
              <button disabled={loading} type="submit" className="flex-[2] py-4 bg-[#010102] text-white rounded-2xl font-bold shadow-xl flex items-center justify-center gap-3 hover:scale-[1.01] disabled:opacity-50 transition-all">
                {loading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : "Verify and Create Account"}
              </button>
            </div>
          </form>
        )}

        <div className="mt-12 pt-8 border-t border-[#efedf2] text-center">
          <p className="text-sm text-gray-500">
            By creating an account, you agree to our 
            <span className="text-[#010102] font-bold mx-1">Privacy Policy</span> and 
            <span className="text-[#010102] font-bold mx-1">Operator Guidelines.</span>
          </p>
          <p className="mt-4 text-sm font-medium">Already registered? <Link to="/captain-login" className="text-[#7b5900] underline font-bold">Access Dashboard</Link></p>
        </div>
      </div>
    </div>
  )
};

const Input = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div>
    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</label>
    <input required type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-[#efedf2] bg-[#fbf8fd] px-5 py-3.5 text-sm outline-none focus:border-[#010102] transition-all" />
  </div>
);

const UploadCard = ({ label, type, preview, onChange, onRemove, full }) => (
  <div className={`${full ? 'md:col-span-2' : ''} space-y-3`}>
    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</label>
    <div className="relative h-40 group cursor-pointer">
      {!preview ? (
        <div className="h-full w-full border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 group-hover:border-[#7b5900] group-hover:bg-[#fbf8fd] transition-all cursor-pointer relative overflow-hidden">
          <input required type="file" accept="image/*" onChange={(e) => onChange(e, type)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
          <FaCloudUploadAlt className="text-3xl text-gray-300 group-hover:text-[#7b5900] transition-all" />
          <span className="text-xs font-bold text-gray-400 group-hover:text-[#010102]">Tap to Upload</span>
        </div>
      ) : (
        <div className="h-full w-full rounded-2xl overflow-hidden relative shadow-lg">
          <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button type="button" onClick={() => onRemove(type)} className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <FaTrash />
            </button>
          </div>
          <div className="absolute top-3 right-3 bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
            <FaCheckCircle size={12} />
          </div>
        </div>
      )}
    </div>
  </div>
);

export default CaptainSignup;
