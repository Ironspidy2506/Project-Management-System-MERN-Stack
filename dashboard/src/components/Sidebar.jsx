import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AdminContext } from "../context/AdminContext.jsx";
import { GrDashboard } from "react-icons/gr";
import { MdDashboard } from "react-icons/md";
import { FaChartLine, FaTasks } from "react-icons/fa";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { FaUser, FaUsers } from "react-icons/fa6";
import { UserContext } from "../context/UserContext.jsx";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { atoken } = useContext(AdminContext);
  const { token } = useContext(UserContext);

  const handleOverlayClick = (e) => {
    if (e.target.id === "overlay") {
      toggleSidebar();
    }
  };

  return (
    <>
      {(atoken || token) && isOpen && (
        <div
          id="overlay"
          className="fixed inset-0  md:hidden"
          onClick={handleOverlayClick}
        ></div>
      )}

      <aside
        className={`fixed inset-y-0 top-16 left-0 bg-white shadow-md w-64 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        
        <nav className="flex flex-col mt-10 px-6 pb-6 space-y-6">
          {/* Admin Links */}
          {atoken && (
            <>
              <NavLink
                to="/admin-dashboard"
                className={({ isActive }) =>
                  `flex items-center space-x-3 text-sm font-medium px-4 py-2 rounded-md transition ${
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-200"
                  }`
                }
                onClick={toggleSidebar}
              >
                <GrDashboard className="text-lg" />
                <span className="text-md">Dashboard</span>
              </NavLink>
              <NavLink
                to="/projects"
                className={({ isActive }) =>
                  `flex items-center space-x-3 text-sm font-medium px-4 py-2 rounded-md transition ${
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-200"
                  }`
                }
                onClick={toggleSidebar}
              >
                <MdDashboard className="text-lg" />
                <span className="text-md">Projects</span>
              </NavLink>
              <NavLink
                to="/tasks"
                className={({ isActive }) =>
                  `flex items-center space-x-3 text-sm font-medium px-4 py-2 rounded-md transition ${
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-200"
                  }`
                }
                onClick={toggleSidebar}
              >
                <FaTasks className="text-lg" />
                <span className="text-md">Tasks</span>
              </NavLink>
              <NavLink
                to="/performance"
                className={({ isActive }) =>
                  `flex items-center space-x-3 text-sm font-medium px-4 py-2 rounded-md transition ${
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-200"
                  }`
                }
                onClick={toggleSidebar}
              >
                <FaChartLine className="text-lg" />
                <span className="text-md">Performance</span>
              </NavLink>
              <NavLink
                to="/departments"
                className={({ isActive }) =>
                  `flex items-center space-x-3 text-sm font-medium px-4 py-2 rounded-md transition ${
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-200"
                  }`
                }
                onClick={toggleSidebar}
              >
                <HiOutlineOfficeBuilding className="text-lg" />
                <span className="text-md">Departments</span>
              </NavLink>
              <NavLink
                to="/employees"
                className={({ isActive }) =>
                  `flex items-center space-x-3 text-sm font-medium px-4 py-2 rounded-md transition ${
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-200"
                  }`
                }
                onClick={toggleSidebar}
              >
                <FaUsers className="text-lg" />
                <span className="text-md">Employees</span>
              </NavLink>
            </>
          )}

          {/* Doctor Links */}
          {token && (
            <>
              <NavLink
                to="/employee-dashboard"
                className={({ isActive }) =>
                  `flex items-center space-x-3 text-sm font-medium px-4 py-2 rounded-md transition ${
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-200"
                  }`
                }
                onClick={toggleSidebar}
              >
                <GrDashboard className="text-lg" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink
                to="/employee-projects"
                className={({ isActive }) =>
                  `flex items-center space-x-3 text-sm font-medium px-4 py-2 rounded-md transition ${
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-200"
                  }`
                }
                onClick={toggleSidebar}
              >
                <MdDashboard className="text-lg" />
                <span className="text-md">My Projects</span>
              </NavLink>
              <NavLink
                to="/employee-tasks"
                className={({ isActive }) =>
                  `flex items-center space-x-3 text-sm font-medium px-4 py-2 rounded-md transition ${
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-200"
                  }`
                }
                onClick={toggleSidebar}
              >
                <FaTasks className="text-lg" />
                <span className="text-md">My Tasks</span>
              </NavLink>

              <NavLink
                to="/employee-performance"
                className={({ isActive }) =>
                  `flex items-center space-x-3 text-sm font-medium px-4 py-2 rounded-md transition ${
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-200"
                  }`
                }
                onClick={toggleSidebar}
              >
                <FaChartLine className="text-lg" />
                <span className="text-md">My Performance</span>
              </NavLink>
              <NavLink
                to="/employee-profile"
                className={({ isActive }) =>
                  `flex items-center space-x-3 text-sm font-medium px-4 py-2 rounded-md transition ${
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-200"
                  }`
                }
                onClick={toggleSidebar}
              >
                <FaUser className="text-lg" />
                <span className="text-md">My Profile</span>
              </NavLink>
            </>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
