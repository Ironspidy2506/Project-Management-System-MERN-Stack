import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Select from "react-select";
import { ManagerContext } from "../../context/ManagerContext.jsx";

const ManagerEmployeePerformances = () => {
  const { mtoken } = useContext(ManagerContext);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeIdForFetch, setEmployeeIdForFetch] = useState("");
  const [state, setState] = useState("Add");
  const [viewBy, setViewBy] = useState("");
  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [projects, setProjects] = useState([]);
  const [performances, setPerformances] = useState([]);
  const [filteredPerformances, setFilteredPerformances] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [performanceDetails, setPerformanceDetails] = useState({
    performanceDatabaseId: "",
    projectId: "",
    performanceId: "",
    drawingType: "",
    date: "",
    drawingReleased: [],
    drawings: 0,
  });

  const getPerformances = async () => {
    try {
      const { data } = await axios.get(
        `https://korus-pms-backend.onrender.com/api/user/get-employees-performances-for-manager`,
        {
          headers: { mtoken },
        }
      );

      if (data.success) {
        const filteredPerformances = data.performances.filter(
          (performance) => performance.user.role === "User"
        );

        setPerformances(filteredPerformances);
        setFilteredPerformances(filteredPerformances);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (mtoken) {
      getPerformances();
    }
  }, [mtoken]);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleFetch = async () => {
    if (viewBy === "date" && date) {
      try {
        const { data } = await axios.get(
          `https://korus-pms-backend.onrender.com/api/performances/get-date-wise-for-manager/${date}`,
          { headers: { mtoken } }
        );

        if (data.success) {
          setPerformances(data.performances);
          toast.success(data.message);
        } else {
          toast.error(data.error);
        }
      } catch (error) {
        toast.error(error.message);
      }
    } else if (viewBy === "month" && month && year) {
      try {
        const { data } = await axios.get(
          `https://korus-pms-backend.onrender.com/api/performances/get-month-wise-for-manager/${month}/${year}`,
          { headers: { mtoken } }
        );

        if (data.success) {
          setPerformances(data.performances);
          toast.success(data.message);
        } else {
          toast.error(data.error);
        }
      } catch (error) {
        toast.error(error.message);
      }
    } else if (viewBy === "employee" && employeeIdForFetch) {
      try {
        const { data } = await axios.get(
          `https://korus-pms-backend.onrender.com/api/performances/get-employee-wise/${employeeIdForFetch}`,
          { headers: { mtoken } }
        );

        if (data.success) {
          setPerformances(data.performances);
          toast.success(data.message);
        } else {
          toast.error(data.error);
        }
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      toast.error("Please fill the required fields!");
    }
  };

  const handleApprove = async (performanceId) => {
    try {
      const { data } = await axios.post(
        `https://korus-pms-backend.onrender.com/api/performances/change-status-manager/${performanceId}`,
        { status: "approved" },
        { headers: { mtoken } }
      );

      if (data.success) {
        toast.success(data.message);
        getPerformances();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to approve performance.");
    }
  };

  const handleReject = async (performanceId) => {
    try {
      const { data } = await axios.post(
        `https://korus-pms-backend.onrender.com/api/performances/change-status-manager/${performanceId}`,
        { status: "rejected" },
        { headers: { mtoken } }
      );

      if (data.success) {
        toast.success(data.message);
        getPerformances();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to reject performance.");
    }
  };

  const handleSearch = () => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = performances.filter(
      (performance) =>
        performance.performanceId.toLowerCase().includes(lowerCaseQuery) ||
        performance.project?.projectName?.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredPerformances(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery, performances]);

  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex justify-between items-center bg-white shadow px-3 py-4 rounded-md">
        <h1 className="text-2xl font-semibold text-gray-700">
          Employees Performances Management
        </h1>
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
            <option value="employee">Employee wise</option>
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

        {viewBy === "employee" && (
          <div className="flex items-center space-x-2">
            <label htmlFor="employeeId" className="text-gray-700 font-medium">
              Enter Employee ID:
            </label>
            <input
              type="text"
              value={employeeIdForFetch}
              onChange={(e) => setEmployeeIdForFetch(e.target.value)}
              className="p-2 border rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>
        )}

        <button
          onClick={handleFetch}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Fetch Performances
        </button>
      </div>

      {/* Search bar */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Search by Performance ID or Project Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
      </div>

      {/* Performance Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full border-collapse bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-blue-400 text-white">
            <tr>
              <th className="border px-4 py-2 text-center">Performance ID</th>
              <th className="border px-4 py-2 text-center">Project Name</th>
              <th className="border px-4 py-2 text-center">Drawing By</th>
              <th className="border px-4 py-2 text-center">Drawing Type</th>
              <th className="border px-4 py-2 text-center">Drawings</th>
              <th className="border px-4 py-2 text-center">Date</th>
              <th className="border px-4 py-2 text-center">Approval Status</th>
              <th className="border px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPerformances.map((performance) => (
              <tr key={performance.performanceId}>
                <td className="border px-4 py-2 text-center">
                  {performance.performanceId}
                </td>
                <td className="border px-4 py-2 text-center">
                  {performance.project?.projectName}
                </td>
                <td className="border px-4 py-2 text-center">
                  {performance.user?.name}
                </td>
                <td className="border px-4 py-2 text-center">
                  {performance.drawingType}
                </td>
                <td className="border px-4 py-2 text-center">
                  {performance.drawings}
                </td>
                <td className="border px-4 py-2 text-center">
                  {formatDate(performance.date)}
                </td>
                <td
                  className={`border px-4 py-2 text-center ${
                    performance.status === "pending"
                      ? "text-yellow-500 font-bold"
                      : performance.status === "approved"
                      ? "text-green-500 font-bold"
                      : performance.status === "rejected"
                      ? "text-red-500 font-bold"
                      : ""
                  }`}
                >
                  {performance.status.charAt(0).toUpperCase() +
                    performance.status.slice(1)}
                </td>
                <td className="border px-4 py-2 text-center space-x-2">
                  {performance.status === "pending" ? (
                    <div className="flex flex-col md:flex-row items-center justify-center gap-1 w-full">
                      <button
                        onClick={() => handleApprove(performance._id)}
                        className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 w-full md:flex-1"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleReject(performance._id)}
                        className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 w-full md:flex-1"
                      >
                        Reject
                      </button>
                    </div>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Performance Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">
              {state === "Add" ? "Add" : "Edit"} Performance
            </h2>
            <div className="space-y-4">
              {/* Project Select */}
              <div className="flex flex-col">
                <label
                  htmlFor="projectId"
                  className="text-gray-700 font-medium mb-2"
                >
                  Select Project
                </label>
                <select
                  id="projectId"
                  value={performanceDetails.projectId}
                  onChange={(e) => handleProjectChange(e.target.value)}
                  disabled={state === "Edit"}
                  className="w-full p-2 border rounded focus:outline-none"
                >
                  <option value="">Select Project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.projectId} - {project.projectName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Performance Id */}
              <div className="flex flex-col">
                <label
                  htmlFor="drawings"
                  className="text-gray-700 font-medium mb-2"
                >
                  Performance ID
                </label>
                <input
                  id="performanceId"
                  type="text"
                  placeholder="Performance ID "
                  value={performanceDetails.performanceId}
                  readOnly
                  className="w-full p-2 border rounded focus:outline-none"
                />
              </div>

              {/* Employees Select */}
              <div className="flex flex-col">
                <label
                  htmlFor="drawingReleased"
                  className="text-gray-700 font-medium mb-2"
                >
                  Drawing Released By
                </label>
                <Select
                  id="drawingReleased"
                  isMulti
                  options={employeeOptions}
                  value={performanceDetails.drawingReleased
                    .map((id) => {
                      const employee = employeeOptions.find(
                        (option) => option.value === id
                      );
                      return employee || null;
                    })
                    .filter(Boolean)}
                  onChange={(selectedOptions) =>
                    setPerformanceDetails({
                      ...performanceDetails,
                      drawingReleased: selectedOptions.map(
                        (option) => option.value
                      ),
                    })
                  }
                  placeholder="Select Employees"
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </div>

              {/* Drawing Type Select */}
              <div className="flex flex-col">
                <label
                  htmlFor="drawingType"
                  className="text-gray-700 font-medium mb-2"
                >
                  Select Drawing Type
                </label>
                <Select
                  id="drawingType"
                  value={drawingTypeOptions.find(
                    (option) => option.value === performanceDetails.drawingType
                  )}
                  onChange={(selectedOption) =>
                    setPerformanceDetails({
                      ...performanceDetails,
                      drawingType: selectedOption ? selectedOption.value : "",
                    })
                  }
                  options={drawingTypeOptions}
                  placeholder="Select Drawing Type"
                  className="w-full focus:outline-none"
                  classNamePrefix="react-select"
                />
              </div>

              {/* Number of Drawings Input */}
              <div className="flex flex-col">
                <label
                  htmlFor="drawings"
                  className="text-gray-700 font-medium mb-2"
                >
                  Number of Drawings
                </label>
                <input
                  id="drawings"
                  type="number"
                  placeholder="Number of Drawings"
                  value={performanceDetails.drawings}
                  onWheel={(e) => e.target.blur()}
                  onChange={(e) =>
                    setPerformanceDetails({
                      ...performanceDetails,
                      drawings: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded focus:outline-none"
                />
              </div>

              {/* Date Input */}
              <div className="flex flex-col">
                <label
                  htmlFor="date"
                  className="text-gray-700 font-medium mb-2"
                >
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  value={performanceDetails.date}
                  onChange={(e) =>
                    setPerformanceDetails({
                      ...performanceDetails,
                      date: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded focus:outline-none"
                />
              </div>

              <div className="flex flex-row gap-2">
                <button
                  onClick={
                    state === "Add"
                      ? handleAddPerformance
                      : handleEditPerformance
                  }
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  {state === "Add" ? "Add Performance" : "Save Changes"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerEmployeePerformances;
