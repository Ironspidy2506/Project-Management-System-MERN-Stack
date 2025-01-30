import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { ManagerContext } from "../../context/ManagerContext.jsx";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import the eye icons

const ManagerProjects = () => {
  const { mtoken } = useContext(ManagerContext);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [projectPassword, setProjectPassword] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [startDate, setStartDate] = useState(null); // Use startDate and startTime separately
  const [startTime, setStartTime] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [costId, setCostId] = useState("");
  const [costName, setCostName] = useState("");
  const [costAmount, setCostAmount] = useState("");
  const [profile, setProfile] = useState({});
  const [costs, setCosts] = useState([]);
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility

  useEffect(() => {
    if (mtoken) {
      getProjects();
      getProfile();
      getCosts();
    }
  }, [mtoken]);

  const getProjects = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/user/get-my-projects`,
        {
          headers: { mtoken },
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

  const getProfile = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/user/get-my-profile`,
        {
          headers: { mtoken },
        }
      );

      setProfile(data.user);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const getCosts = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/cost/get-cost-added-by-manager`,
        {
          headers: { mtoken },
        }
      );

      if (data.success) {
        setCosts(data.costs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }
  };

  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    setSelectedProject(projectId);

    const project = projects.find((proj) => proj._id === projectId);

    if (!project) {
      toast.error("Project not found!");
      return;
    }

    const projectCosts = costs.filter((cost) => cost.project._id === projectId);
    const nextCostIndex = projectCosts.length + 1;

    setCostId(`C_${profile.employeeId}_${project.projectId}_${nextCostIndex}`);
  };

  const handleAddCost = async () => {
    try {
      if (!selectedProject || !costId || !costName || !costAmount) {
        toast.error("Please fill all fields!");
        return;
      }

      const { data } = await axios.post(
        `http://localhost:5000/api/cost/add-cost-manager`,
        { projectId: selectedProject, costId, costName, costAmount },
        {
          headers: { mtoken },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setIsModalOpen(false);
        setSelectedProject("");
        setCostId("");
        setCostName("");
        setCostAmount("");
        getProjects();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }
  };

  const handleStartTracking = async () => {
    try {
      if (!projectId || !projectPassword) {
        toast.error("Please enter both Project ID and Password!");
        return;
      }

      const currentDateTime = new Date();

      // Format date as 'yyyy-mm-dd'
      const date = currentDateTime.toISOString().split("T")[0]; // Get the date in 'yyyy-mm-dd' format
      const time = currentDateTime.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const { data } = await axios.post(
        `http://localhost:5000/api/project-log/start-project`,
        {
          projectId,
          projectPassword,
          startDate: date,
          startTime: time,
        },
        {
          headers: { mtoken },
        }
      );

      if (data.success) {
        const logId = data.logId;
        localStorage.setItem("currentLogId", logId);
        setIsTracking(true);
        setStartDate(date); // Set start date locally
        setStartTime(time); // Set start time locally
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
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

      const currentDateTime = new Date(); // Ensure this is declared inside the function

      // Format date as 'yyyy-mm-dd'
      const date = currentDateTime.toISOString().split("T")[0]; // Get the date in 'yyyy-mm-dd' format
      const time = currentDateTime.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const { data } = await axios.post(
        `http://localhost:5000/api/project-log/end-project`,
        {
          logId,
          endDate: date, // Send endDate in 'yyyy-mm-dd' format
          endTime: time, // Send endTime
        },
        {
          headers: { mtoken },
        }
      );

      if (data.success) {
        toast.success(data.message);
        localStorage.removeItem("currentLogId");
        setIsTracking(false);
        setStartDate(null);
        setStartTime(null);
        getProjects();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }
  };

  useEffect(() => {
    const logId = localStorage.getItem("currentLogId");
    if (logId) {
      setIsTracking(true);
    }
  }, []);

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex justify-between items-center bg-white shadow p-3 rounded-md">
        <h1 className="text-2xl font-semibold text-gray-700">
          Project Management
        </h1>
        <div className="flex flex-row gap-2">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={() => setIsModalOpen(true)}
          >
            + Add Cost
          </button>
          <button
            className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
            onClick={() => navigate(`/manager-projects/cost-log`)}
          >
            Cost Log
          </button>
        </div>
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
          disabled={isTracking}
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="p-2 border rounded-md w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
        <div className="relative w-1/3">
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Enter Project Password"
            disabled={isTracking}
            value={projectPassword}
            onChange={(e) => setProjectPassword(e.target.value)}
            className="p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500"
          >
            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
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
                <td
                  className={`border border-gray-200 px-4 py-2 text-center ${
                    project.status === "Yet to Start"
                      ? "bg-gray-200 text-gray-700"
                      : project.status === "Started"
                      ? "bg-blue-200 text-blue-700"
                      : project.status === "On Progress"
                      ? "bg-orange-200 text-orange-700"
                      : project.status === "Completed"
                      ? "bg-green-200 text-green-700"
                      : project.status === "Overdue"
                      ? "bg-red-200 text-red-700"
                      : "bg-white text-black"
                  }`}
                >
                  {project.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerProjects;
