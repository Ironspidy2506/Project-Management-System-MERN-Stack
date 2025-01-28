import React, { useState, useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import Project from "./pages/Admin/Project.jsx";
import Performance from "./pages/Admin/Performance.jsx";
import Tasks from "./pages/Admin/Tasks.jsx";
import Department from "./pages/Admin/Department.jsx";
import Employee from "./pages/Admin/Employee.jsx";
import EmployeeTasks from "./pages/Users/EmployeeTasks.jsx";
import EmployeeProjects from "./pages/Users/EmployeeProjects.jsx";
import EmployeeProfile from "./pages/Users/EmployeeProfile.jsx";
import EmployeeDashboard from "./pages/Users/EmployeeDashboard.jsx";
import EmployeePerformance from "./pages/Users/EmployeePerformance.jsx";
import { AdminContext } from "./context/AdminContext.jsx";
import { UserContext } from "./context/UserContext.jsx";
import { ManagerContext } from "./context/ManagerContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManagerTasks from "./pages/Manager/ManagerTasks.jsx";
import ManagerProjects from "./pages/Manager/ManagerProjects.jsx";
import ManagerDashboard from "./pages/Manager/ManagerDashboard.jsx";
import ManagerProfile from "./pages/Manager/ManagerProfile.jsx";
import ManagerPerformance from "./pages/Manager/ManagerPerformance.jsx";
import ManagerEmployees from "./pages/Manager/ManagerEmployees.jsx";

const App = () => {
  const { atoken } = useContext(AdminContext);
  const { mtoken } = useContext(ManagerContext);
  const { token } = useContext(UserContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return atoken || mtoken || token ? (
    <div className="flex flex-col min-h-screen">
      <ToastContainer />
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        {/* Sidebar: Properly aligned */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 ml-0 md:ml-64 pt-24 p-6">
          {" "}
          {/* Adjusted margin-left for sidebar width */}
          <Routes>
            {/* Admin Routes */}
            <Route
              path="/"
              element={
                <>
                  <h2 className="text-xl font-semibold text-center mb-6 text-blue-500">
                    Welcome to the{" "}
                    {atoken ? "Admin" : mtoken ? "Manager" : "Employee"}{" "}
                    Dashboard!
                  </h2>

                  <h3 className="text-lg font-semibold text-center mb-6 text-blue-500">
                    Please select an option to continue!
                  </h3>
                </>
              }
            />
            <Route path="/admin-dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Project />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/departments" element={<Department />} />
            <Route path="/employees" element={<Employee />} />

            {/* Employee Routes */}
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee-projects" element={<EmployeeProjects />} />
            <Route path="/employee-tasks" element={<EmployeeTasks />} />
            <Route path="/employee-profile" element={<EmployeeProfile />} />
            <Route
              path="/employee-performance"
              element={<EmployeePerformance />}
            />

            <Route path="/manager-dashboard" element={<ManagerDashboard />} />
            <Route path="/manager-projects" element={<ManagerProjects />} />
            <Route path="/manager-tasks" element={<ManagerTasks />} />
            <Route path="/manager-profile" element={<ManagerProfile />} />
            <Route
              path="/manager-performance"
              element={<ManagerPerformance />}
            />
            <Route path="/manager-employees" element={<ManagerEmployees />} />
          </Routes>
        </div>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;
