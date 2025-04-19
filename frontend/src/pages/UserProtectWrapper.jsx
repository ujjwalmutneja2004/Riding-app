// import React, { useContext, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from "axios";
// import { UserDataContext } from '../context/UserContext';


// const UserProtectWrapper = ({
//     children
// }) => {

//     const token=localStorage.getItem('token')
//     const navigate=useNavigate()

//     console.log(token)

//     if(!token){
//         navigate('/login')
//     }


// return (
//     <>
//      {children}
//     </>
//   )
// }

// export default UserProtectWrapper


// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const UserProtectWrapper = ({ children }) => {
//     const navigate = useNavigate();
//     const token = localStorage.getItem('token');
//     const [isAuthenticated, setIsAuthenticated] = useState(!!token);

//     useEffect(() => {
//         if (!token) {
//             navigate('/login');
//         }
//     }, [token, navigate]);

//     if (!isAuthenticated) {
//         return null; // Prevents rendering protected components before navigation happens
//     }

//     return <>{children}</>;
// };

// export default UserProtectWrapper;


import React, { useContext, useEffect, useState } from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserProtectWrapper = ({
    children
}) => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const { user, setUser } = useContext(UserDataContext)
    const [ isLoading, setIsLoading ] = useState(true)

    useEffect(() => {
        if (!token) {
            navigate('/login')
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {
                setUser(response.data)
                setIsLoading(false)
            }
        })
            .catch(err => {
                console.log(err)
                localStorage.removeItem('token')
                navigate('/login')
            })
    }, [ token ])

    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <>
            {children}
        </>
    )
}

export default UserProtectWrapper