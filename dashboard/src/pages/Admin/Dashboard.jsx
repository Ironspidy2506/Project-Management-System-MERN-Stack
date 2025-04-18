import React, { useEffect, useContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { FaChartLine, FaTasks, FaUsers } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { LuLogs } from "react-icons/lu";
import { AdminContext } from "../../context/AdminContext.jsx";

const Dashboard = () => {
  const { atoken } = useContext(AdminContext);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [performances, setPerformances] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [projectLogs, setProjectLogs] = useState([]);

  const getProjects = async () => {
    try {
      const { data } = await axios.get(
        `https://project-management-system-mern-stack.vercel.app/api/projects/get-projects`,
        { headers: { atoken } }
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
        `https://project-management-system-mern-stack.vercel.app/api/tasks/get-tasks`,
        { headers: { atoken } }
      );
      if (data.success) setTasks(data.tasks);
      else toast.error(data.error);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getEmployees = async () => {
    try {
      const { data } = await axios.get(
        `https://project-management-system-mern-stack.vercel.app/api/user/get-users`,
        { headers: { atoken } }
      );
      if (data.success) {
        setEmployees(data.users);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getPerformances = async () => {
    try {
      const { data } = await axios.get(
        `https://project-management-system-mern-stack.vercel.app/api/performances/get-performances`,
        { headers: { atoken } }
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

  const getDepartments = async () => {
    try {
      const { data } = await axios.get(
        `https://project-management-system-mern-stack.vercel.app/api/department/get-departments`,
        { headers: { atoken } }
      );
      if (data.success) {
        setDepartments(data.departments);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getLogs = async () => {
    try {
      const { data } = await axios.get(
        `https://project-management-system-mern-stack.vercel.app/api/project-log/get-logs`,
        { headers: { atoken } }
      );
      if (data.success) {
        setProjectLogs(data.logs);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (atoken) {
      getProjects();
      getEmployees();
      getTasks();
      getPerformances();
      getDepartments();
      getLogs();
    }
  }, [atoken]);

  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex justify-center items-center bg-white shadow p-5 rounded-md mb-6">
        <h1 className="text-2xl font-semibold text-gray-700">Dashboard</h1>
      </header>

      {/* Responsive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Projects */}
        <div className="flex items-center bg-white p-6 shadow-md rounded-lg hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 flex items-center justify-center bg-blue-200 rounded-full">
            <MdDashboard className="text-2xl text-gray-700" />
          </div>
          <div className="ml-6 flex flex-row gap-1.5 justify-center items-center">
            <p className="text-xl font-extrabold text-gray-600">
              {projects.length}
            </p>
            <p className="text-xl font-bold text-gray-600">Projects</p>
          </div>
        </div>

        {/* Employees */}
        <div className="flex items-center bg-white p-6 shadow-md rounded-lg hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 flex items-center justify-center bg-purple-200 rounded-full">
            <FaUsers className="text-xl text-gray-700" />
          </div>
          <div className="ml-6 flex flex-row gap-1.5 justify-center items-center">
            <p className="text-xl font-extrabold text-gray-600">
              {employees.length}
            </p>
            <p className="text-xl font-bold text-gray-600">Employees</p>
          </div>
        </div>

        {/* Departments */}
        <div className="flex items-center bg-white p-6 shadow-md rounded-lg hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 flex items-center justify-center bg-green-200 rounded-full">
            <HiOutlineOfficeBuilding className="text-2xl text-gray-700" />
          </div>
          <div className="ml-6 flex flex-row gap-1.5 justify-center items-center">
            <p className="text-xl font-extrabold text-gray-600">
              {departments.length}
            </p>
            <p className="text-xl font-bold text-gray-600">Departments</p>
          </div>
        </div>

        {/* Tasks */}
        <div className="flex items-center bg-white p-6 shadow-md rounded-lg hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 flex items-center justify-center bg-red-200 rounded-full">
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
          <div className="w-16 h-16 flex items-center justify-center bg-yellow-200 rounded-full">
            <FaChartLine className="text-xl text-gray-700" />
          </div>
          <div className="ml-6 flex flex-row gap-1.5 justify-center items-center">
            <p className="text-xl font-extrabold text-gray-600">
              {performances.length}
            </p>
            <p className="text-xl font-bold text-gray-600">Performances</p>
          </div>
        </div>

        {/* Logs */}
        <div className="flex items-center bg-white p-6 shadow-md rounded-lg hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 flex items-center justify-center bg-orange-200 rounded-full">
            <LuLogs className="text-xl text-gray-700" />
          </div>
          <div className="ml-6 flex flex-row gap-1.5 justify-center items-center">
            <p className="text-xl font-extrabold text-gray-600">
              {projectLogs.length}
            </p>
            <p className="text-xl font-bold text-gray-600">Logs</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
