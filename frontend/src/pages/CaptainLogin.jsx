import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { CaptainDataContext } from '../context/CaptainContext';
import axios from 'axios';
import logo from '../assets/logoo.png';

const CaptainLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/login`,
        { email, password }
      );

      console.log('response', response);

      if (response.status === 200) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem('token', data.token);
        toast.success('✅ Successfully Logged In!', {
          position: 'top-right',
          autoClose: 1000,
        });
        navigate('/captain-home');
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
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img className='w-40 h-20 object-contain mb-5'src={logo} alt="logo" />
        <form onSubmit={submitHandler}>
          <h3 className='text-lg font-medium mb-2'>What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
            type="email"
            placeholder='email@example.com'
          />

          <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
          <div className='relative w-full mb-6'>
            <input
              className='bg-[#eeeeee] rounded px-4 py-2 border w-full text-base placeholder:text-sm'
              required
              type={showPassword ? "text" : "password"}
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

          <button className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg'>
            Login
          </button>

          <p className='text-center'>
            Join a fleet <Link to='/captain-signup' className='text-blue-600'>Register as a Captain</Link>
          </p>
        </form>
      </div>

      <div>
        <Link to='/login' className='bg-[#d5622d] flex items-center justify-center text-white font-semibold mb-4 rounded px-4 py-2 w-full text-lg'>
          Sign in as User
        </Link>
      </div>
    </div>
  );
};

export default CaptainLogin;
