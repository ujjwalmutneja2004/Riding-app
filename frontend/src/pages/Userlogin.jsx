import React, { useState ,useContext} from 'react'
import { Link } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';  // Import eye icons
import logo from '../assets/logoo.png'

export const Userlogin = () => {
  //two way binding
  //so that react ko pata lage ky kar rhe ho
  const [email, setEmail] = useState('');
  const [password,setpassword] = useState('');
  // const[userData,setUserData] = useState({});
    const [showPassword, setShowPassword] = useState(false); // 🔹 Toggle state

  const {user,setUser}=useContext(UserDataContext)
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
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
{/*           <img className='w-16 mb-10'src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png" alt="logo" /> */}
        
         <img className='w-40 h-20 object-contain  mb-5'src={logo} alt="logo" /> 
        <form onSubmit={(e)=>{
            submitHandler(e)
        }}>

        <h3 className='text-lg font-medium mb-2'>What's your email</h3>
          <input required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base' type="email" placeholder='email@example.com'/>

        <h3 className='text-lg font-medium  mb-2' >Enter Password</h3>
         <div className='relative w-full mb-6'>
                                <input
                                    className='bg-[#eeeeee] rounded px-4 py-2 border w-full text-base placeholder:text-sm'
                                    required
                                    type={showPassword ? "text" : "password"}  // 🔹 Toggle visibility
                                    placeholder='password'
                                    value={password}
                                    onChange={(e) => setpassword(e.target.value)}
                                />
                                <span
                                    className='absolute right-4 top-3 cursor-pointer'
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>

        <button className='bg-[#111]  text-white font-semibold mb-3 rounded px-4 py-2  w-full text-lg' >Login</button>

        <p className='text-center'>New here? <Link to='/Signup' className='text-blue-600'>Create New Account</Link></p>
      </form>
      </div>
      <div>
        <Link to='/captain-login' className='bg-[#10b461] flex items-center justify-center text-white font-semibold mb-4 rounded px-4 py-2  w-full text-lg  placeholder:text-base' >Sign in as Captain</Link> 
      </div>

      <button
  onClick={() => {
    window.location.replace=`${import.meta.env.VITE_BASE_URL}/auth/google`;
  }}
  className="flex items-center justify-center bg-white border border-gray-300 shadow-sm rounded px-4 py-2 w-full text-lg font-medium text-gray-600 hover:bg-gray-100"
>
  <img
    src="https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png"
    alt="Google Logo"
    className="w-5 h-5 mr-3"
  />
  Sign in with Google
</button>




    </div>
  )
}
export default Userlogin;
