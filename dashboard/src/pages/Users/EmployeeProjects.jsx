import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { UserContext } from "../../context/UserContext.jsx";

const EmployeeProjects = () => {
  const { token } = useContext(UserContext);
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [projectPassword, setProjectPassword] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (token) {
      getProjects();
    }
  }, [token]);

  const getProjects = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/user/get-my-projects`,
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

      const { data } = await axios.post(
        `http://localhost:5000/api/project-log/start-project`,
        {
          projectId,
          projectPassword,
          startTime: Date.now(), // Send start time as part of the request
        },
        {
          headers: { token },
        }
      );

      if (data.success) {
        const logId = data.logId;
        localStorage.setItem("currentLogId", logId);
        setIsTracking(true);
        setStartTime(Date.now()); // Set start time locally as well
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
        `http://localhost:5000/api/project-log/end-project`,
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
          <input
            type="text"
            placeholder="Enter Project ID"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="p-2 border rounded-md w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
          <input
            type="password"
            placeholder="Enter Project Password"
            value={projectPassword}
            onChange={(e) => setProjectPassword(e.target.value)}
            className="p-2 border rounded-md w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
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
