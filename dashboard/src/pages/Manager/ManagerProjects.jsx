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
        `https://project-management-system-mern-stack.vercel.app/api/user/get-my-projects`,
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
        `https://project-management-system-mern-stack.vercel.app/api/user/get-my-profile`,
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
        `https://project-management-system-mern-stack.vercel.app/api/cost/get-cost-added-by-manager`,
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
        `https://project-management-system-mern-stack.vercel.app/api/cost/add-cost-manager`,
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
          headers: { mtoken },
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
          headers: { mtoken },
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
  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleProjectSelectChange = (e) => {
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
        <select
          value={projectId}
          onChange={handleProjectSelectChange}
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
        <div className="relative w-1/3">
          <input
            type={passwordVisible ? "text" : "password"}
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

      {/* Modal for Adding Cost */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
            <h2 className="text-xl font-bold mb-4 text-center">Add Cost</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Select Project
              </label>
              <select
                value={selectedProject}
                onChange={handleProjectChange} // Use the function that updates costId
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.projectId} - {project.projectName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Cost ID
              </label>
              <input
                type="text"
                value={costId}
                onChange={(e) => setCostId(e.target.value)}
                disabled
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Cost ID"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Cost Name
              </label>
              <input
                type="text"
                value={costName}
                onChange={(e) => setCostName(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter cost name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Cost Amount
              </label>
              <input
                type="number"
                value={costAmount}
                onChange={(e) => setCostAmount(e.target.value)}
                onWheel={(e) => e.target.blur()}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter cost amount"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddCost}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
              >
                Add Cost
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedProject("");
                  setCostId("");
                  setCostName("");
                  setCostAmount("");
                }}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerProjects;
