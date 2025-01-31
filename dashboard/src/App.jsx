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
import ManagerEmployeeTasks from "./pages/Manager/ManagerEmployeeTasks.jsx";
import ManagerEmployeePerformances from "./pages/Manager/ManagerEmployeePerformances.jsx";
import ManagerCostLog from "./pages/Manager/ManagerCostLog.jsx";
import EmployeeLogs from "./pages/Users/EmployeeLogs.jsx";
import ManagerLogs from "./pages/Manager/ManagerLogs.jsx";
import ManagerEmployeeLogs from "./pages/Manager/ManagerEmployeeLogs.jsx";
import CostLogs from "./pages/Admin/CostLogs.jsx";
import Logs from "./pages/Admin/Logs.jsx";

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
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        {/* Sidebar: Adjusted for responsiveness */}
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          className={`fixed inset-y-0 left-0 w-64 bg-gray-800 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 transition-transform duration-300`}
        />

        <div className="flex-1 pt-20 px-4 md:ml-64 lg:px-8">
          <ToastContainer />
          <Routes>
            {/* Admin Routes */}
            <Route
              path="/"
              element={
                <div className="text-center mt-5">
                  <h2 className="text-xl font-semibold mb-4 text-blue-500">
                    Welcome to the{" "}
                    {atoken ? "Admin" : mtoken ? "Manager" : "Employee"}{" "}
                    Dashboard!
                  </h2>
                  <h3 className="text-lg font-semibold text-blue-500">
                    Please select an option to continue!
                  </h3>
                </div>
              }
            />
            <Route path="/admin-dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Project />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/departments" element={<Department />} />
            <Route path="/employees" element={<Employee />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/projects/costs-log" element={<CostLogs />} />

            {/* Employee Routes */}
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee-projects" element={<EmployeeProjects />} />
            <Route path="/employee-tasks" element={<EmployeeTasks />} />
            <Route path="/employee-profile" element={<EmployeeProfile />} />
            <Route
              path="/employee-performance"
              element={<EmployeePerformance />}
            />
            <Route path="/employee-logs" element={<EmployeeLogs />} />

            {/* Manager Routes */}
            <Route path="/manager-dashboard" element={<ManagerDashboard />} />
            <Route path="/manager-projects" element={<ManagerProjects />} />
            <Route
              path="/manager-projects/cost-log"
              element={<ManagerCostLog />}
            />
            <Route path="/manager-tasks" element={<ManagerTasks />} />
            <Route
              path="/manager-tasks/employee-tasks"
              element={<ManagerEmployeeTasks />}
            />
            <Route path="/manager-profile" element={<ManagerProfile />} />
            <Route
              path="/manager-performance"
              element={<ManagerPerformance />}
            />
            <Route
              path="/manager-performance/employee-performances"
              element={<ManagerEmployeePerformances />}
            />
            <Route path="/manager-employees" element={<ManagerEmployees />} />
            <Route path="/manager-logs" element={<ManagerLogs />} />
            <Route
              path="/manager-logs/employee-logs"
              element={<ManagerEmployeeLogs />}
            />
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
