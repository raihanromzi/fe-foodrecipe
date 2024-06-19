import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function useToken() {
  const navigate = useNavigate();
  const location = useLocation();

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const getUserId = () => {
    return localStorage.getItem("userId");
  };

  const [token, setToken] = useState(getToken());
  const [userId, setUserId] = useState(getUserId());
  const [isExpired, setIsExpired] = useState(false);

  const saveToken = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const saveUserId = (userId) => {
    localStorage.setItem("userId", userId);
    setUserId(userId);
  };

  const checkTokenExpiry = () => {
    if (!token) return false;
  
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = new Date().getTime();
      // JWT exp is in seconds
      return decodedToken.exp * 1000 < currentTime;
    } catch (error) {
      console.error("Error decoding token: ", error);
      return true;
    }
  };
  

  useEffect(() => {
    if (checkTokenExpiry()) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      setToken(null);
      setUserId(null);
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token && location.pathname !== "/") {
      navigate("/");
    } else if (
      token &&
      (location.pathname === "/" || location.pathname === "/signup")
    ) {
      navigate("/daftar-resep");
    }
  }, [token, location, navigate]);

  return {
    setToken: saveToken,
    setUserId: saveUserId,
    token,
    userId,
  };
}
