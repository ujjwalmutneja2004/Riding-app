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
        <div className='p-5 h-screen flex flex-col justify-between'>
            <div>
                <img className='w-16 mb-10' src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png" alt="logo" />
                
                <form onSubmit={submitHandler}>
                    <h3 className='text w-1/2 font-medium mb-2'>What's your name</h3>
                    <div className='flex gap-4 mb-6'>
                        <input
                            required
                            className='bg-[#eeeeee] w-1/2 rounded px-4 py-1 border text-base placeholder:text-sm'
                            type="text"
                            placeholder='Firstname'
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <input
                            required
                            className='bg-[#eeeeee] w-1/2 rounded px-4 py-1 border text-base placeholder:text-sm'
                            type="text"
                            placeholder='Lastname'
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <h3 className='text-base font-medium mb-2'>Enter your Email</h3>
                    <input
                        required
                        className='bg-[#eeeeee] mb-5 rounded px-4 py-2 border w-full text-base placeholder:text-sm'
                        type="email"
                        placeholder='email@example.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <h3 className='text-base font-medium mb-2'>Enter Password</h3>
                    <div className='relative w-full mb-6'>
                        <input
                            className='bg-[#eeeeee] rounded px-4 py-2 border w-full text-base placeholder:text-sm'
                            required
                            type={showPassword ? "text" : "password"}  // 🔹 Toggle visibility
                            placeholder='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                            className='absolute right-4 top-3 cursor-pointer'
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <button className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg'>Create Account</button>

                    <p className='text-center text-sm'>
                        Already have an account? <Link to='/login' className='text-blue-600'>Sign In</Link>
                    </p>
                </form>
            </div>

            <div>
                <p className='text-[10px] leading-tight text-center'>
                    By proceeding, you consent to receive calls, WhatsApp, or SMS messages, including automated messages, from Uber and its affiliates to the number provided.
                </p>
            </div>
        </div>
    );
};

export default UserSignup;
