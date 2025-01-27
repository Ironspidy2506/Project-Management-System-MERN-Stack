import React, { useState, useContext } from "react";
import Login from "./pages/Login.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "./context/AdminContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import { UserContext } from "./context/UserContext.jsx";
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

const App = () => {
  const { atoken } = useContext(AdminContext);
  const { token } = useContext(UserContext);
  // const {dtoken}
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return atoken || token ? (
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
                    Welcome to the {atoken ? "Admin" : "Employee"} Dashboard!
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
            <Route path="/employee-performance" element={<EmployeePerformance/>} />


            {/* <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor-profile" element={<DoctorProfile />} />
            <Route
              path="/doctor-appointments"
              element={<DoctorAppointments />}
            /> */}
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
