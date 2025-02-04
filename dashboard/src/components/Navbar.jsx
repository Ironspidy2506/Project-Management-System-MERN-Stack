import React, { useContext } from "react";
import KorusImg from "../assets/Korus.png";
import { useNavigate } from "react-router-dom"; // To navigate on logout
import { AdminContext } from "../context/AdminContext";
import { UserContext } from "../context/UserContext";
import { ManagerContext } from "../context/ManagerContext";
import { logout } from "../utils/Logout";
import { toast } from "react-toastify";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  // Access the context values
  const { atoken, setAToken } = useContext(AdminContext);
  const { mtoken, setMToken } = useContext(ManagerContext);
  const { token, setToken } = useContext(UserContext);

  // Handle Logout
  const handleLogout = () => {
    logout(navigate, atoken, setAToken, mtoken, setMToken, token, setToken); // Pass required params
  };

  return (
    <nav className="z-50 shadow-md w-full fixed top-0 bg-white">
      <div className="w-full px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="text-black md:hidden focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          <img src={KorusImg} alt="Logo" className="w-12 h-12 rounded-full" />
          <h1 className="text-xl font-bold text-gray-700">
            Korus Engineering Solutions Pvt. Ltd.
          </h1>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 text-sm font-medium text-white"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
