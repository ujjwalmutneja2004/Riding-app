// import React, { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom';
// import axios from "axios";
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import {UserDataContext} from '../context/UserContext'  
// const UserSignup = () => {

//         const [email, setEmail] = useState('');
//         const [password,setpassword] = useState('');
//         const[firstName,setFirstName] = useState('');
//         const[lastName,setLastName] = useState('');
//         const[userData,setuserData]=useState({})

//         const navigate=useNavigate()

//         const {user,setUser}=React.useContext(UserDataContext)
          
//         const submitHandler = async (e) => {
//           e.preventDefault();
        
//           const newUser = {
//             fullname: {  // ✅ Match backend field name
//               firstname: firstName,  // ✅ Use lowercase 'firstname'
//               lastname: lastName  // ✅ Use lowercase 'lastname'
//             },
//             email: email,
//             password: password
//           };
        
//           try {
//             const response = await axios.post(
//               `${import.meta.env.VITE_BASE_URL}/users/register`,
//               newUser,
//               { withCredentials: true }
//             );
        
//             if (response.status === 201) {
//               const data = response.data;
//               setUser(data.user); // Set user in context
//               toast.success('✅ Successfully Account Created!', { position: 'top-right', autoClose: 3000 });
//               navigate('/home');
//             }
        
//             console.log(response.data);
        
//             // Clear form after successful signup
//             setEmail('');
//             setFirstName('');
//             setLastName('');
//             setpassword('');
            
//           } catch (error) {
//             console.error("Signup failed:", error.response ? error.response.data : error.message);
//           }
//         };        
  
//   return (
//       <div className='p-7 h-screen flex flex-col justify-between'>
//                <div>
//                 <img className='w-16 mb-10'src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png" alt="logo" />
//               <form onSubmit={(e)=>{
//                   submitHandler(e)
//               }}>
      
//             <h3 className='text w-1/2 font-medium mb-2'>What's your name</h3>
//                <div className='flex gap-4 mb-6'>
//                 <input 
//                 required
//                 className='bg-[#eeeeee] w-1/2 rounded px-4 py-1 border text- placeholder:text-base'
//                  type="text" placeholder='Firstname'
//                  value={firstName}
//                  onChange={(e)=>{
//                  setFirstName(e.target.value)
//                  }}
//                  />
      
//                 <input 
//                 required
//                 className='bg-[#eeeeee] w-1/2 rounded px-4 py-1 border text-lg placeholder:text-base' 
//                 type="text" placeholder='Lastname'
//                 value={lastName}
//                 onChange={(e)=>{
//                 setLastName(e.target.value)
//                 }}
                
//                 />
      
//                  </div>
      
//               <h3 className='text-base font-medium mb-2'>Enter your Email</h3>
//                 <input required 
//                   className='bg-[#eeeeee] mb-5 rounded px-4 py-2 border w-full text-base placeholder:text-sm' 
//                 type="email" placeholder='email@example.com'
//                 value={email}
//                 onChange={(e)=>{
//                 setEmail(e.target.value)
//                 }}
//                 />

      
//               <h3 className='text-base font-medium  mb-2' >Enter Password</h3>
//               <input className='bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-base placeholder:text-sm'  
//               required type="password" placeholder='password'
//               value={password}
//               onChange={(e)=>{
//               setpassword(e.target.value)
//               }}
//               />


//               <button className='bg-[#111]  text-white font-semibold mb-3 rounded px-4 py-2  w-full text-lg' >Create Account</button>
      
//               <p className='text-center'>Already Have a Account? <Link to='/login' className='text-blue-600'>Sign In</Link></p>
//             </form>
//             </div>
//             <div>
//               <p className='text-[10px] leading-tight'>
//                 By Proceeding , you consent to get calls, Whatsapp or SMS Messages,including by automated means ,from Uber and its affiliates to number provided
//               </p>
      
        
//             </div>
//     </div>
//   )
// }

// export default UserSignup
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserDataContext } from '../context/UserContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';  // Import eye icons
import logo from '../assets/logoo.png';

const UserSignup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [showPassword, setShowPassword] = useState(false); // 🔹 Toggle state

    const navigate = useNavigate();
    const { user, setUser } = React.useContext(UserDataContext);

    const submitHandler = async (e) => {
        e.preventDefault();

        const newUser = {
            fullname: { firstname: firstName, lastname: lastName },
            email: email,
            password: password
        };

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/users/register`,
                newUser,
                { withCredentials: true }
            );

            if (response.status === 201) {
                const data = response.data;
                setUser(data.user);
                localStorage.setItem('token',data.token)
                
                // ✅ Show success toast
                toast.success('✅ Account Created Successfully!', {
                    position: 'top-center',  // 🔹 Centered for mobile
                    autoClose: 2000,
                    hideProgressBar: true,
                    style: { fontSize: '14px' }  // 🔹 Smaller text for mobile
                });

                // ✅ Clear input fields after successful signup
                setEmail('');
                setFirstName('');
                setLastName('');
                setPassword('');
                navigate('/home');
            }
        } catch (error) {
            console.error("Signup failed:", error.response?.data || error.message);

            // ✅ Show error toast
            toast.error(error.response?.data?.message || '❌ Signup Failed. Try Again!', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: true,
                style: { fontSize: '14px' }  // 🔹 Mobile-friendly toast
            });
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
                <div className="mt-6 sm:mt-8 bg-white py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-gray-100">
                    <form className="space-y-6" onSubmit={submitHandler}>
                        {/* Name fields */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full name
                            </label>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <input
                                        required
                                        type="text"
                                        placeholder="First name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-all outline-none"
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        required
                                        type="text"
                                        placeholder="Last name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>

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
                                    placeholder="email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-all outline-none"
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
                                    autoComplete="new-password"
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-all outline-none pr-10"
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

                        {/* Submit */}
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 transition-colors"
                            >
                                Create account
                            </button>
                        </div>

                        {/* Sign in link */}
                        <div className="text-center text-sm">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>

                    {/* Footer notice */}
                    <div className="mt-4">
                        <p className="text-xs text-gray-500 text-center leading-relaxed">
                            By proceeding, you consent to receive calls, WhatsApp, or SMS messages, including automated messages, from TravelX and its affiliates to the number provided.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserSignup;
