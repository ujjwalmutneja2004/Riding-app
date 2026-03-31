import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminProtectWrapper = ({ children }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate("/admin/login", { replace: true });
            return;
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/admin/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
            if (response.status === 200) {
                setIsAuthenticated(true);
            }
        })
        .catch(err => {
            console.error("Admin Auth Error:", err);
            localStorage.removeItem("token");
            navigate("/admin/login", { replace: true });
        })
        .finally(() => {
            setIsLoading(false);
        });
    }, [token, navigate]);

    if (isLoading) {
        return (
            <div className="h-screen bg-[#fbf8fd] flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-[#7b5900] border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return isAuthenticated ? <>{children}</> : null;
};

export default AdminProtectWrapper;
