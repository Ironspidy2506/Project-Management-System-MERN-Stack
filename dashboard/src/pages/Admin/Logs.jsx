import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext.jsx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Logs = () => {
  const { atoken } = useContext(AdminContext);
  const [employeeId, setEmployeeId] = useState("");
  const [viewBy, setViewBy] = useState("");
  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [projectLogs, setProjectLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const getProjectLogs = async () => {
    try {
      const { data } = await axios.get(
        `https://project-management-system-mern-stack.vercel.app/api/project-log/get-logs`,
        {
          headers: { atoken },
        }
      );

      console.log(data);

      if (data.success) {
        setProjectLogs(data.logs);
        setFilteredLogs(data.logs);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (atoken) {
      getProjectLogs();
    }
  }, [atoken]);

  const handleFetch = () => {
    if (!viewBy) {
      toast.error("Please select a view option!");
      return;
    }

    let filteredLogs = [...projectLogs]; // Copy logs for filtering

    if (viewBy === "date" && date) {
      filteredLogs = filteredLogs.filter((log) =>
        log.startTime.startsWith(date)
      );
    } else if (viewBy === "month" && month && year) {
      filteredLogs = filteredLogs.filter((log) => {
        const logDate = new Date(log.startTime);
        return (
          logDate.getMonth() + 1 === parseInt(month) &&
          logDate.getFullYear() === parseInt(year)
        );
      });
    } else if (viewBy === "employee" && employeeId.trim() !== "") {
      filteredLogs = filteredLogs.filter(
        (log) =>
          log.user?.employeeId?.toLowerCase() === employeeId.toLowerCase()
      );
    }

    setFilteredLogs(filteredLogs); // Update UI with filtered logs
  };

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const filtered = projectLogs.filter(
      (log) =>
        log.project?.projectId?.toLowerCase().includes(query) ||
        log.project?.projectName?.toLowerCase().includes(query) ||
        log.user?.employeeId?.toLowerCase().includes(query) ||
        log.user?.name?.toLowerCase().includes(query)
    );
    setFilteredLogs(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

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

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredLogs.map((log) => ({
        "Project ID": log.project?.projectId || "N/A",
        "Project Name": log.project?.projectName || "N/A",
        "Employee ID": log.user?.employeeId || "N/A",
        "Employee Name": log.user?.name || "N/A",
        "Start Time": log.startTime
          ? log.added
            ? formatAddedDateTime(log.startTime)
            : formatCapturedDateTime(log.startTime)
          : "N/A",
        "End Time": log.endTime
          ? log.added
            ? formatAddedDateTime(log.endTime)
            : formatCapturedDateTime(log.endTime)
          : "Time not captured yet",
        "Total Time (Hrs)": log.totalTime || "N/A",
        "Log Type": log.added ? "Added" : "Captured",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Project Logs");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Project_Logs.xlsx");
  };

  return (
    <>
      <div className="p-6">
        {/* Header */}
        <header className="flex justify-between items-center bg-white shadow p-4 rounded-md">
          <h1 className="text-2xl font-semibold text-gray-700">
            Logs Management
          </h1>
          <div className="flex gap-3">
            <button
              onClick={exportToExcel}
              className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition-all"
            >
              Export to Excel
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
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="p-2 border rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>
          )}

          <button
            onClick={handleFetch}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Fetch Logs
          </button>
        </div>

        {/* Search bar */}
        <div className="mt-6">
          <input
            type="text"
            placeholder="Search by Project ID, Project Name, Employee ID, or Employee Name"
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
                <th className="border px-4 py-2 text-center">Emp ID</th>
                <th className="border px-4 py-2 text-center">Emp Name</th>
                <th className="border px-4 py-2 text-center">Start Time</th>
                <th className="border px-4 py-2 text-center">End Time</th>
                <th className="border px-4 py-2 text-center">Total Time</th>
                <th className="border px-4 py-2 text-center">Log Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((logs, index) => (
                <tr key={logs._id}>
                  <td className="border px-4 py-2 text-base text-center text-gray-800">
                    {logs.project?.projectId}
                  </td>
                  <td className="border px-4 py-2 text-base text-center text-gray-800">
                    {logs.project?.projectName}
                  </td>
                  <td className="border px-4 py-2 text-base text-center text-gray-800">
                    {logs.user?.employeeId}
                  </td>
                  <td className="border px-4 py-2 text-base text-center text-gray-800">
                    {logs.user?.name}
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
                  <td className="border px-4 py-2 text-base text-center text-gray-800">
                    {logs.totalTime} Hrs
                  </td>
                  <td className="border px-4 py-2 text-base text-center text-gray-800">
                    {logs.added ? "Added" : "Captured"}
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

export default Logs;
