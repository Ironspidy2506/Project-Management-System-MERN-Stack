import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { ManagerContext } from "../../context/ManagerContext.jsx";

const ManagerLogs = () => {
  const { mtoken } = useContext(ManagerContext);
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState("");
  const [state, setState] = useState("");
  const [viewBy, setViewBy] = useState("");
  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [projects, setProjects] = useState([]);
  const [projectLogs, setProjectLogs] = useState([]);
  const [filteredProjectLogs, setFilteredProjectLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [logDetails, setLogDetails] = useState({
    projectId: "",
    startDate: "",
    startTime: "", // Fixed `starTime` typo
    endDate: "",
    endTime: "",
  });

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

  const getProjectLogs = async () => {
    try {
      const { data } = await axios.get(
        `https://project-management-system-mern-stack.vercel.app/api/user/get-my-project-logs`,
        {
          headers: { mtoken },
        }
      );
      if (data.success) {
        setProjectLogs(data.projectlogs);
        setFilteredProjectLogs(data.projectlogs);
      } else toast.error(data.error);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const formatAddedDateTime = (dateTime) => {
    const [date, time] = dateTime.split("T");
    const [year, month, day] = date.split("-");
    const formattedDate = `${day}-${month}-${year}`;
    const trimmedTime = time.slice(0, 5);

    let [hours, minutes] = trimmedTime.split(":");
    hours = parseInt(hours);
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return `${formattedDate} ${hours}:${minutes} ${ampm}`;
  };

  const formatCapturedDateTime = (dateTime) => {
    const date = new Date(dateTime); // Convert the string to a Date object
    const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if day is single digit
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if month is single digit
    const year = date.getFullYear(); // Get the year

    let hours = date.getHours(); // Get hours
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Get minutes with leading zero

    const ampm = hours >= 12 ? "PM" : "AM"; // Check if it's AM or PM
    hours = hours % 12; // Convert 24-hour format to 12-hour format
    hours = hours ? hours : 12; // If hours is 0, change to 12 for 12 AM

    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`; // Format to dd-mm-yyyy hh:mm AM/PM
  };

  useEffect(() => {
    if (mtoken) {
      getProjectLogs();
      getProjects();
    }
  }, [mtoken]);

  const handleAddLog = async () => {
    const { projectId, startDate, startTime, endDate, endTime } = logDetails;

    if (!projectId || !startDate || !startTime || !endDate || !endTime) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const { data } = await axios.post(
        `https://project-management-system-mern-stack.vercel.app/api/project-log/add-log`,
        logDetails, // Use logDetails directly
        {
          headers: { mtoken },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setShowModal(false);
        setLogDetails({
          // Fix: Reset `logDetails`, not `logDetails`
          projectId: "",
          startDate: "",
          startTime: "",
          endDate: "",
          endTime: "",
        });
        getProjectLogs(); // Refresh logs
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to add log");
    }
  };

  const handleEditLog = async () => {
    const { logDatabaseId, startDate, startTime, endDate, endTime } =
      logDetails;

    if (!logDatabaseId || !startDate || !startTime || !endDate || !endTime) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const { data } = await axios.post(
        `https://project-management-system-mern-stack.vercel.app/api/project-log/edit-log/${logDatabaseId}`,
        logDetails,
        {
          headers: { mtoken },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setShowModal(false);
        setLogDetails({
          projectId: "",
          startDate: "",
          startTime: "",
          endDate: "",
          endTime: "",
          logDatabaseId: "",
        });
        getProjectLogs(); // Refresh logs
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to edit log");
    }
  };

  const handleEdit = (log) => {
    if (!log || !log.startTime || !log.endTime) return;

    const startDate = log.startTime.split("T")[0];
    const startTime = log.startTime.slice(11, 16);
    const endDate = log.endTime.split("T")[0];
    const endTime = log.endTime.slice(11, 16);
    setLogDetails({
      projectId: log.project?._id,
      startDate: startDate,
      startTime: startTime,
      endDate: endDate,
      endTime: endTime,
      logDatabaseId: log._id,
    });

    setShowModal(true);
    setState("Edit");
  };

  const handleDeleteLog = async (logId) => {
    try {
      const { data } = await axios.delete(
        `https://project-management-system-mern-stack.vercel.app/api/project-log/delete-log/${logId}`,
        {
          headers: { mtoken },
        }
      );
      if (data.success) {
        getProjectLogs();
        toast.success(data.message);
      } else toast.error(data.error);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFetch = async () => {
    if (viewBy === "date" && date) {
      try {
        const { data } = await axios.get(
          `https://project-management-system-mern-stack.vercel.app/api/project-log/get-date-wise/${date}`,
          { headers: { mtoken } }
        );

        console.log(data);

        if (data.success) {
          setProjectLogs(data.logs);
          setFilteredProjectLogs(data.logs);
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    } else if (viewBy === "month" && month && year) {
      try {
        const { data } = await axios.get(
          `https://project-management-system-mern-stack.vercel.app/api/project-log/get-month-wise/${month}/${year}`,
          { headers: { mtoken } }
        );

        if (data.success) {
          setProjectLogs(data.logs);
          setFilteredProjectLogs(data.logs);
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      toast.error("Please fill the required fields!");
    }
  };

  const handleSearch = () => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = projectLogs.filter(
      (log) =>
        log.project?.projectId.toLowerCase().includes(lowerCaseQuery) ||
        log.project?.projectName.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredProjectLogs(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  return (
    <>
      <div className="p-6">
        {/* Header */}
        <header className="flex justify-between items-center bg-white shadow p-3 rounded-md">
          <h1 className="text-2xl font-semibold text-gray-700">
            Project Logs Management
          </h1>
          <div className="flex flex-row gap-2">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              onClick={() => {
                setShowModal(true);
                setState("Add");
                setLogDetails({
                  projectId: "",
                  projectLogId: "",
                  task: "",
                  startDate: "",
                  dueDate: "",
                });
              }}
            >
              + Add Log
            </button>
            <button
              className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
              onClick={() => navigate("/manager-logs/employee-logs")}
            >
              Employee Logs
            </button>
          </div>
        </header>

        {/* View By Section */}
        <div className="mt-6 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="viewBy" className="text-gray-700 font-medium">
              View By:
            </label>
            <select
              id="viewBy"
              value={viewBy}
              onChange={(e) => setViewBy(e.target.value)}
              className="p-2 border rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            >
              <option value="">Select Option</option>
              <option value="date">Date wise</option>
              <option value="month">Month wise</option>
            </select>
          </div>

          {/* Conditional Inputs */}
          {viewBy === "date" && (
            <div className="flex items-center space-x-2">
              <label htmlFor="date" className="text-gray-700 font-medium">
                Select Date:
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="p-2 border rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>
          )}

          {viewBy === "month" && (
            <div className="flex items-center space-x-2">
              <label htmlFor="month" className="text-gray-700 font-medium">
                Month:
              </label>
              <select
                id="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="p-2 border rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              >
                <option value="">Select Month</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>
              <label htmlFor="year" className="text-gray-700 font-medium">
                Year:
              </label>
              <input
                id="year"
                type="number"
                placeholder="Year"
                value={year}
                onWheel={(e) => e.target.blur()}
                onChange={(e) => setYear(e.target.value)}
                className="p-2 border rounded-md w-24 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>
          )}

          <button
            onClick={handleFetch}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
          >
            Fetch Logs
          </button>
        </div>

        {/* Search bar */}
        <div className="mt-6">
          <input
            type="text"
            placeholder="Search by Project ID or Project Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>

        {/* Task Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse bg-white shadow rounded-lg overflow-hidden">
            <thead className="bg-blue-400 text-white">
              <tr>
                <th className="border px-4 py-2 text-center">Project ID</th>
                <th className="border px-4 py-2 text-center">Project Name</th>
                <th className="border px-4 py-2 text-center">Start Time</th>
                <th className="border px-4 py-2 text-center">End Time</th>
                <th className="border px-4 py-2 text-center">Total Time</th>
                <th className="border px-4 py-2 text-center">Log Type</th>

                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjectLogs.map((logs, index) => (
                <tr key={logs._id}>
                  <td className="border px-4 py-2 text-sm text-center text-gray-800">
                    {logs.project?.projectId}
                  </td>
                  <td className="border px-4 py-2 text-sm text-center text-gray-800">
                    {logs.project?.projectName}
                  </td>
                  <td className="border px-4 py-2 text-sm text-center text-gray-800">
                    {logs.startTime
                      ? logs.added
                        ? formatAddedDateTime(logs.startTime)
                        : formatCapturedDateTime(logs.startTime)
                      : ""}
                  </td>
                  <td className="border px-4 py-2 text-sm text-center text-gray-800">
                    {logs.endTime
                      ? logs.added
                        ? formatAddedDateTime(logs.endTime)
                        : formatCapturedDateTime(logs.endTime)
                      : "Time not captured yet"}
                  </td>
                  <td className="border px-4 py-2 text-sm text-center text-gray-800">
                    {logs.totalTime}
                  </td>
                  <td className="border px-4 py-2 text-sm text-center text-gray-800">
                    {logs.added ? "Added" : "Captured"}
                  </td>
                  <td className="border px-4 py-2 flex justify-center gap-2">
                    {logs.added ? (
                      <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
                        <button
                          onClick={() => handleEdit(logs)}
                          className="px-4 py-2 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                      </div>
                    ) : null}
                    <button
                      onClick={() => handleDeleteLog(logs._id)}
                      className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Log Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center">
              {state === "Add" ? "Add" : "Edit"} Log
            </h2>
            <div className="space-y-2">
              {/* Select Project */}
              <div>
                <label className="text-gray-700 font-medium mb-2">
                  Select Project
                </label>
                <select
                  disabled={state === "Edit"}
                  value={logDetails.projectId}
                  onChange={(e) =>
                    setLogDetails({
                      ...logDetails,
                      projectId: e.target.value,
                    })
                  }
                  className="p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.projectId} - {project.projectName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date and Time */}
              <div className="flex space-x-2">
                <div className="w-1/2">
                  <label className="text-gray-700 font-medium mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={logDetails.startDate} // Fix here
                    onChange={(e) =>
                      setLogDetails({
                        ...logDetails,
                        startDate: e.target.value,
                      })
                    }
                    className="p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="w-1/2">
                  <label className="text-gray-700 font-medium mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={logDetails.startTime}
                    onChange={(e) =>
                      setLogDetails({
                        ...logDetails,
                        startTime: e.target.value,
                      })
                    }
                    className="p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* End Date and Time */}
              <div className="flex space-x-2">
                <div className="w-1/2">
                  <label className="text-gray-700 font-medium mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={logDetails.endDate}
                    onChange={(e) =>
                      setLogDetails({
                        ...logDetails,
                        endDate: e.target.value,
                      })
                    }
                    className="p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="w-1/2">
                  <label className="text-gray-700 font-medium mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={logDetails.endTime}
                    onChange={(e) =>
                      setLogDetails({
                        ...logDetails,
                        endTime: e.target.value,
                      })
                    }
                    className="p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-4 flex flex-row gap-2">
                <button
                  onClick={state === "Add" ? handleAddLog : handleEditLog}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  {state === "Add" ? "Add Log" : "Save Changes"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManagerLogs;
