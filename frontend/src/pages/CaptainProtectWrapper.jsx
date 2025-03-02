// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const CaptainProtectWrapper = ({ children }) => {
//     const navigate = useNavigate();
//     const token = localStorage.getItem('token');
//     const [isAuthenticated, setIsAuthenticated] = useState(!!token); // Immediately false if no token
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         if (!token) {
//             console.log("🚨 No token found! Redirecting to login.");
//             navigate('/captain-login', { replace: true });
//             return;
//         }

//         console.log("🔍 Checking authentication...");

//         axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
//             headers: { Authorization: `Bearer ${token}` }
//         })
//         .then(response => {
//             if (response.status === 200) {
//                 console.log("✅ Authentication successful!");
//                 setIsAuthenticated(true);
//             }
//         })
//         .catch(err => {
//             console.log("❌ Authentication failed. Redirecting...", err);
//             localStorage.removeItem('token');

//             navigate('/captain-login', { replace: true });
//         })
//         .finally(() => {
//             setIsLoading(false);
//         });

//     }, [token, navigate]);

//     if (isLoading) {
//         return <div style={{ textAlign: 'center', marginTop: '20px' }}>⏳ Loading...</div>;
//     }

//     if (!isAuthenticated) {
//         return null; // Ensures nothing renders if not authenticated
//     }

//     return <>{children}</>;
// };

// export default CaptainProtectWrapper;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainProtectWrapper = ({ children }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);

    useEffect(() => {
        console.log("🔍 Checking captain authentication...");
        
        if (!token) {
            console.warn("🚨 No token found! Redirecting to captain login...");
            navigate("/captain-login", { replace: true });
            return;
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
            console.log("✅ Captain authenticated successfully:", response.data);
            setIsAuthenticated(true);
        })
        .catch(err => {
            console.error("❌ Captain authentication failed:", err);
            localStorage.removeItem("token");
            navigate("/captain-login", { replace: true });
        });
    }, [token, navigate]);

    if (!isAuthenticated) {
        console.log("⏳ Waiting for authentication...");
        return null; // Prevents rendering protected content before authentication check
    }

    return <>{children}</>;
};

export default CaptainProtectWrapper;
