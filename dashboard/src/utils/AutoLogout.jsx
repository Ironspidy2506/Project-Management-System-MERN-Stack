import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext.jsx";
import { UserContext } from "../context/UserContext.jsx";
import { ManagerContext } from "../context/ManagerContext.jsx";
import { logout } from "../utils/Logout.jsx";

const AutoLogout = () => {
  const navigate = useNavigate();
  const { atoken, setAToken } = useContext(AdminContext);
  const { mtoken, setMToken } = useContext(ManagerContext);
  const { token, setToken } = useContext(UserContext);

  useEffect(() => {
    const checkLogoutTime = () => {
      const now = new Date();
      const istTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );

      const hours = istTime.getHours();
      const minutes = istTime.getMinutes();

      if (hours === 17 && minutes === 50) {
        logout(navigate, atoken, setAToken, mtoken, setMToken, token, setToken);
      }
    };

    const interval = setInterval(checkLogoutTime, 30000);

    return () => clearInterval(interval);
  }, [navigate, setAToken, setMToken, setToken]);

  return null;
};

export default AutoLogout;
