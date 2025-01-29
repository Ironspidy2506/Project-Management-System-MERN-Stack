import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { ManagerContext } from "../../context/ManagerContext.jsx";
import { useNavigate } from "react-router-dom";

const ManagerCostLog = () => {
  const { mtoken } = useContext(ManagerContext);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [projectPassword, setProjectPassword] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [costName, setCostName] = useState("");
  const [costAmount, setCostAmount] = useState("");

  useEffect(() => {
    if (mtoken) {
      getProjects();
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

  const handleAddCost = async () => {
    try {
      if (!selectedProject || !costName || !costAmount) {
        toast.error("Please fill all fields!");
        return;
      }

      const { data } = await axios.post(
        `http://localhost:5000/api/project/add-cost`,
        { projectId: selectedProject, costName, costAmount },
        {
          headers: { mtoken },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setIsModalOpen(false);
        setSelectedProject("");
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

  return (
    <>
      <div className="p-6">
        {/* Header */}
        <header className="flex justify-between items-center bg-white shadow py-4 px-3 rounded-md">
          <h1 className="text-2xl font-semibold text-gray-700">
            Projects Cost Management
          </h1>
        </header>

        {/* Modal for Adding Cost */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4 text-center">Add Cost</h2>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Select Project
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
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
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter cost amount"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCost}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Add Cost
                </button>
              </div>
            </div>
          </div>
        )}

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
                  Cost ID
                </th>
                <th className="border border-gray-200 px-4 py-2 text-center">
                  Cost Name
                </th>
                <th className="border border-gray-200 px-4 py-2 text-center">
                  Cost Amount
                </th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </>
  );
};

export default ManagerCostLog;
