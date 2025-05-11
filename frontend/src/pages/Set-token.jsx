import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SetToken = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      console.log("Token set in localStorage:", token);
      navigate("/home");
    } else {
      console.error("No token found in query params");
      navigate("/login");
    }
  }, [navigate]);

  return <div>Processing Authentication...</div>;
};

export default SetToken;

