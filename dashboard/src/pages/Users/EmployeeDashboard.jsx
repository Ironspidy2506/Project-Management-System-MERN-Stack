import React, { useEffect, useContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { UserContext } from "../../context/UserContext.jsx";
import { FaChartLine, FaTasks } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const EmployeeDashboard = () => {
  const { token } = useContext(UserContext);
  const [projects, setProjects] = useState([]);
  const [performances, setPerformances] = useState([]);
  const [tasks, setTasks] = useState([]);

  const getProjects = async () => {
    try {
      const { data } = await axios.get(
        `https://korus-pms.onrender.com/api/user/get-my-projects`,
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

  const getTasks = async () => {
    try {
      const { data } = await axios.get(
        `https://korus-pms.onrender.com/api/user/get-my-tasks`,
        {
          headers: { token },
        }
      );

      if (data.success) setTasks(data.tasks);
      else toast.error(data.error);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getPerformances = async () => {
    try {
      const { data } = await axios.get(
        `https://korus-pms.onrender.com/api/user/get-my-performances`,
        {
          headers: { token },
        }
      );
      if (data.success) {
        setPerformances(data.performances);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getProjects();
      getTasks();
      getPerformances();
    }
  }, [token]);

  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex justify-center items-center bg-white shadow p-4 rounded-md mb-6">
        <h1 className="text-2xl font-semibold text-gray-700">Dashboard</h1>
      </header>

      {/* Responsive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Projects */}
        <div className="flex items-center bg-white p-6 shadow-md rounded-lg hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full">
            <MdDashboard className="text-xl text-gray-700" />
          </div>
          <div className="ml-6 flex flex-row gap-1.5 justify-center items-center">
            <p className="text-xl font-extrabold text-gray-600">
              {projects.length}
            </p>
            <p className="text-xl font-bold text-gray-600">Projects</p>
          </div>
        </div>

        {/* Tasks */}
        <div className="flex items-center bg-white p-6 shadow-md rounded-lg hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full">
            <FaTasks className="text-xl text-gray-700" />
          </div>
          <div className="ml-6 flex flex-row gap-1.5 justify-center items-center">
            <p className="text-xl font-extrabold text-gray-600">
              {tasks.length}
            </p>
            <p className="text-xl font-bold text-gray-600">Tasks</p>
          </div>
        </div>

        {/* Performances */}
        <div className="flex items-center bg-white p-6 shadow-md rounded-lg hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 flex items-center justify-center bg-yellow-100 rounded-full">
            <FaChartLine className="text-xl text-gray-700" />
          </div>
          <div className="ml-6 flex flex-row gap-1.5 justify-center items-center">
            <p className="text-xl font-extrabold text-gray-600">
              {performances.length}
            </p>
            <p className="text-xl font-bold text-gray-600">Performances</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
