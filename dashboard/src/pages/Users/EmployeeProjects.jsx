import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { UserContext } from "../../context/UserContext.jsx";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // Import icons

const EmployeeProjects = () => {
  const { token } = useContext(UserContext);
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [projectPassword, setProjectPassword] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (token) {
      getProjects();
    }
  }, [token]);

  useEffect(() => {
    // Check if there's a running project in localStorage
    const logId = localStorage.getItem("currentLogId");
    if (logId) {
      // If there's a log ID, set tracking state to true and fetch the start time
      setProjectId(localStorage.getItem("selectedProjectId"));
      setProjectPassword(localStorage.getItem("selectedProjectPassword"));
      setIsTracking(true);
      setStartTime(localStorage.getItem("startTime"));
    }
  }, []);

  const getProjects = async () => {
    try {
      const { data } = await axios.get(
        `https://project-management-system-mern-stack.vercel.app/api/user/get-my-projects`,
        {
          headers: { token },
        }
      );

      if (data.success) {
        setProjects(data.projects);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleStartTracking = async () => {
    try {
      if (!projectId || !projectPassword) {
        toast.error("Please enter both Project ID and Password!");
        return;
      }

      const startDate = new Date(); // Get current date and time
      const startTime = startDate.toISOString(); // Convert it to ISO string format

      const { data } = await axios.post(
        `https://project-management-system-mern-stack.vercel.app/api/project-log/start-project`,
        {
          projectId,
          projectPassword,
          startTime, // Send the start time (ISO string)
        },
        {
          headers: { token },
        }
      );

      if (data.success) {
        const logId = data.logId;
        localStorage.setItem("currentLogId", logId);
        setIsTracking(true);
        setStartTime(startTime); // Set start time locally
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error starting project:", error);
      toast.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }
  };

  const handleStopTracking = async () => {
    try {
      if (!isTracking) {
        toast.error("Time tracking hasn't started yet!");
        return;
      }

      const logId = localStorage.getItem("currentLogId");

      if (!logId) {
        toast.error("No log ID found. Cannot end project.");
        return;
      }

      const { data } = await axios.post(
        `https://project-management-system-mern-stack.vercel.app/api/project-log/end-project`,
        {
          logId,
          endTime: Date.now(), // Send end time as part of the request
        },
        {
          headers: { token },
        }
      );

      if (data.success) {
        toast.success(data.message);
        localStorage.removeItem("currentLogId");
        localStorage.removeItem("selectedProjectId");
        localStorage.removeItem("selectedProjectPassword");
        setProjectId("");
        setProjectPassword("");
        setIsTracking(false);
        setStartTime(null);
        getProjects();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error stopping project:", error);
      toast.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }
  };

  // Update project ID and save to localStorage
  const handleProjectChange = (e) => {
    const selectedProject = e.target.value;
    setProjectId(selectedProject);
    setProjectPassword(""); // Reset password when changing projects
    localStorage.setItem("selectedProjectId", selectedProject);
  };

  // Update project password and save to localStorage
  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setProjectPassword(password);
    localStorage.setItem("selectedProjectPassword", password);
  };

  return (
    <>
      <div className="p-6">
        {/* Header */}
        <header className="flex justify-between items-center bg-white shadow p-4 rounded-md">
          <h1 className="text-2xl font-semibold text-gray-700">
            Project Management
          </h1>
        </header>

        {/* Inputs for Project ID and Password */}
        <div className="mt-6 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="viewBy" className="text-gray-700 font-medium">
              Time Capture for:
            </label>
          </div>
          <select
            value={projectId}
            onChange={handleProjectChange}
            className="p-2 border rounded-md w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          >
            <option value="" disabled>
              Select a project
            </option>
            {projects.map((project) => (
              <option key={project.projectId} value={project.projectId}>
                {project.projectId} - {project.projectName}
              </option>
            ))}
          </select>

          {/* Password Input with Eye Toggle */}
          <div className="relative w-1/3">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Project Password"
              value={projectPassword}
              onChange={handlePasswordChange}
              className="p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              autoComplete="off"
              name="fakePassword"
              id="fakePassword"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-600"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={22} />
              ) : (
                <AiOutlineEye size={22} />
              )}
            </button>
          </div>

          {!isTracking ? (
            <button
              onClick={handleStartTracking}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Start Capturing
            </button>
          ) : (
            <button
              onClick={handleStopTracking}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Stop Capturing
            </button>
          )}
        </div>

        {/* Project Table */}
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full border-collapse bg-white shadow rounded-lg overflow-hidden">
            <thead className="bg-blue-400 text-white">
              <tr>
                <th className="border border-gray-200 px-4 py-2 text-center">
                  Project ID
                </th>
                <th className="border border-gray-200 px-4 py-2 text-center">
                  Project Name
                </th>
                <th className="border border-gray-200 px-4 py-2 text-center">
                  Estimated Cost
                </th>
                <th className="border border-gray-200 px-4 py-2 text-center">
                  Consumed Cost
                </th>
                <th className="border border-gray-200 px-4 py-2 text-center">
                  Estimated Hours
                </th>
                <th className="border border-gray-200 px-4 py-2 text-center">
                  Consumed Hours
                </th>
                <th className="border border-gray-200 px-4 py-2 text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {project.projectId}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {project.projectName}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    ₹{project.estimatedCost || 0}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    ₹{project.currentCost || 0}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {project.estimatedHours || 0}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {project.currentHours || 0}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {project.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default EmployeeProjects;
