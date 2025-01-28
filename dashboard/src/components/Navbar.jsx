import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext.jsx";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
import KorusImg from "../assets/Korus.png";
import { ManagerContext } from "../context/ManagerContext.jsx";

const Navbar = ({ toggleSidebar }) => {
  const { atoken, setAToken } = useContext(AdminContext);
  const { mtoken, setMToken } = useContext(ManagerContext);
  const { token, setToken } = useContext(UserContext);
  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
    if (atoken) {
      setAToken("");
      localStorage.removeItem("atoken");
    }

    if (mtoken) {
      setMToken("");
      localStorage.removeItem("mtoken");
    }

    if (token) {
      setToken("");
      localStorage.removeItem("token");
    }
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

          {atoken ? (
            <span className="text-white textlg font-bold bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 rounded-full shadow-md">
              {" "}
              Admin{" "}
            </span>
          ) : (
            <></>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 text-sm font-medium text-white"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
