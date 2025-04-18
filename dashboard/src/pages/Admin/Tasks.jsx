import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Select from "react-select";
import { AdminContext } from "../../context/AdminContext.jsx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Tasks = () => {
  const { atoken } = useContext(AdminContext);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeIdForFetch, setEmployeeIdForFetch] = useState("");
  const [state, setState] = useState("");
  const [viewBy, setViewBy] = useState("");
  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [projects, setProjects] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [taskDetails, setTaskDetails] = useState({
    projectId: "",
    taskId: "",
    task: "",
    startDate: "",
    dueDate: "",
    assignedEmployee: null,
    taskDatabaseId: "",
  });
  const [employees, setEmployees] = useState([]);

  const getProjects = async () => {
    try {
      const { data } = await axios.get(
        "https://project-management-system-mern-stack.vercel.app/api/projects/get-projects",
        {
          headers: { atoken },
        }
      );
      if (data.success) setProjects(data.projects);
      else toast.error(data.error);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getEmployees = async () => {
    try {
      const { data } = await axios.get(
        "https://project-management-system-mern-stack.vercel.app/api/user/get-users",
        {
          headers: { atoken },
        }
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

  const getTasks = async () => {
    try {
      const { data } = await axios.get(
        "https://project-management-system-mern-stack.vercel.app/api/tasks/get-tasks",
        { headers: { atoken } }
      );

      if (data.success) {
        setTasks(data.tasks);
        setFilteredTasks(data.tasks);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Error fetching tasks");
    }
  };

  const handleEmployeeSelectChange = (selectedOption) => {
    setTaskDetails((prev) => {
      const selectedEmployee = employees.find(
        (employee) => employee._id === selectedOption.value
      );

      if (!selectedEmployee) {
        console.error("Selected employee not found!");
        return prev;
      }

      if (!prev.selectedProject) {
        console.warn("Project must be selected before assigning an employee!");
        return {
          ...prev,
          assignedEmployee: selectedOption.value,
        };
      }

      return {
        ...prev,
        assignedEmployee: selectedOption.value,
        taskId: `T_${selectedEmployee.employeeId}_${
          prev.selectedProject.projectId
        }_${
          tasks.filter(
            (task) => task.project?.projectId === prev.selectedProject.projectId
          ).length + 1
        }_ADMIN`,
      };
    });
  };

  const handleProjectChange = (projectId) => {
    const selectedProject = projects.find(
      (project) => project._id === projectId
    );

    setTaskDetails((prev) => ({
      ...prev,
      projectId: projectId,
      selectedProject,
    }));
  };

  const handleAddTask = async () => {
    const { projectId, taskId, task, startDate, dueDate, assignedEmployee } =
      taskDetails;

    if (
      !projectId ||
      !taskId ||
      !task ||
      !startDate ||
      !dueDate ||
      !assignedEmployee
    ) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const { data } = await axios.post(
        "https://project-management-system-mern-stack.vercel.app/api/tasks/add-task-admin",
        {
          projectId,
          assignedEmployee,
          taskId,
          task,
          startDate,
          dueDate,
        },
        {
          headers: { atoken },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setShowModal(false);
        setTaskDetails({
          projectId: "",
          taskId: "",
          task: "",
          startDate: "",
          dueDate: "",
        });
        getTasks();
      } else toast.error(data.message);
    } catch (error) {
      toast.error("Failed to add task");
    }
  };

  const handleEditTask = async () => {
    const { task, startDate, dueDate, taskDatabaseId } = taskDetails;

    if (!taskDatabaseId || !task || !startDate || !dueDate) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const { data } = await axios.post(
        `https://project-management-system-mern-stack.vercel.app/api/tasks/edit-task-admin/${taskDatabaseId}`,
        {
          task,
          startDate,
          dueDate,
        },
        {
          headers: { atoken },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setShowModal(false);
        setTaskDetails({
          projectId: "",
          taskId: "",
          task: "",
          startDate: "",
          dueDate: "",
        });
        getTasks();
      } else toast.error(data.message);
    } catch (error) {
      toast.error("Failed to edit task");
    }
  };

  const handleUpdateStatus = async (taskId, status) => {
    try {
      const { data } = await axios.post(
        `https://project-management-system-mern-stack.vercel.app/api/tasks/complete-task-admin/${taskId}`,
        { status },
        { headers: { atoken } }
      );

      if (data.success) {
        toast.success(data.message);
        getTasks();
      } else toast.error(data.message);
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const { data } = await axios.delete(
        `https://project-management-system-mern-stack.vercel.app/api/tasks/delete-task-admin/${taskId}`,
        { headers: { atoken } }
      );

      if (data.success) {
        toast.success(data.message);
        getTasks();
      } else toast.error(data.message);
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    if (atoken) {
      getProjects();
      getEmployees();
      getTasks();
    }
  }, [atoken]);

  const handleFetch = () => {
    if (!viewBy) {
      toast.error("Please select a view option!");
      return;
    }

    let filteredData = [...tasks];

    if (viewBy === "date" && date) {
      filteredData = filteredData.filter(
        (task) => task.startDate && task.startDate.startsWith(date) // Using startDate instead of date
      );
    } else if (viewBy === "month" && month && year) {
      filteredData = filteredData.filter((task) => {
        const taskDate = new Date(task.startDate); // Using startDate instead of date
        console.log(taskDate);

        return (
          taskDate.getMonth() + 1 === parseInt(month, 10) &&
          taskDate.getFullYear() === parseInt(year, 10)
        );
      });
    } else if (viewBy === "employee" && employeeIdForFetch.trim() !== "") {
      filteredData = filteredData.filter(
        (task) =>
          task.user?.employeeId?.toLowerCase() ===
          employeeIdForFetch.toLowerCase()
      );
    }

    if (filteredData.length === 0) {
      toast.error("No task records found");
    } else {
      toast.success("Tasks fetched successfully");
    }

    setFilteredTasks(filteredData); // Update UI with filtered performances
  };

  const handleSearch = () => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = tasks.filter(
      (task) =>
        task.taskId.toLowerCase().includes(lowerCaseQuery) ||
        task.project?.projectName?.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredTasks(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery, tasks]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredTasks.map((task) => ({
        "Task ID": task.taskId,
        "Project Name": task.project?.projectName || "",
        Task: task.task,
        "Emp ID": task.user?.employeeId || "",
        "Emp Name": task.user?.name || "",
        "Start Date": task.startDate.split("T")[0],
        "Due Date": task.dueDate.split("T")[0],
        Status: task.status.charAt(0).toUpperCase() + task.status.slice(1),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(data, "Task_Data.xlsx");
  };

  return (
    <>
      <div className="p-6">
        {/* Header */}
        <header className="flex justify-between items-center bg-white shadow p-4 rounded-md">
          <h1 className="text-2xl font-semibold text-gray-700">
            Tasks Management
          </h1>
          <div className="flex gap-2">
          <button
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all"
            onClick={() => {
              setShowModal(true);
              setState("Add");
              setTaskDetails({
                projectId: "",
                taskId: "",
                task: "",
                startDate: "",
                dueDate: "",
              });
            }}
          >
            + Assign Task
          </button>
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
                value={employeeIdForFetch}
                onChange={(e) => setEmployeeIdForFetch(e.target.value)}
                className="p-2 border rounded-md w-48 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>
          )}

          <button
            onClick={() => handleFetch()}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Fetch Tasks
          </button>
        </div>

        {/* Search bar */}
        <div className="mt-6">
          <input
            type="text"
            placeholder="Search by Task ID or Project Name"
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
                <th className="border px-4 py-2 text-center">Task ID</th>
                <th className="border px-4 py-2 text-center">Project Name</th>
                <th className="border px-4 py-2 text-center">Task</th>
                <th className="border px-4 py-2 text-center">Emp ID</th>
                <th className="border px-4 py-2 text-center">Emp Name</th>
                <th className="border px-4 py-2 text-center">Start Date</th>
                <th className="border px-4 py-2 text-center">Due Date</th>
                <th className="border px-4 py-2 text-center">Status</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.taskId} className="hover:bg-gray-50 transition">
                  <td className="border px-4 py-2 text-center">
                    {task.taskId}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {task.project?.projectName}
                  </td>
                  <td className="border px-4 py-2 text-center">{task.task}</td>
                  <td className="border px-4 py-2 text-center">
                    {task.user?.employeeId}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {task.user?.name}
                  </td>

                  <td className="border px-4 py-2 text-center">
                    {formatDate(task.startDate)}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {formatDate(task.dueDate)}
                  </td>
                  <td
                    className={`border border-gray-200 px-4 py-2 text-center ${
                      task.status === "pending"
                        ? "text-yellow-500 font-bold"
                        : task.status === "completed"
                        ? "text-green-500 font-bold"
                        : task.status === "rejected"
                        ? "text-red-500 font-bold"
                        : ""
                    }`}
                  >
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {task.status === "pending" ? (
                      <div className="flex flex-col md:flex-row items-center justify-center gap-1 w-full">
                        <button
                          onClick={() =>
                            handleUpdateStatus(task._id, "completed")
                          }
                          className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 w-full md:flex-1"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => {
                            setState("Edit");
                            setTaskDetails({
                              projectId: task.project?._id,
                              taskId: task.taskId,
                              task: task.task,
                              startDate: task.startDate.split("T")[0],
                              dueDate: task.dueDate.split("T")[0],
                              assignedEmployee: task.user?._id || "",
                              taskDatabaseId: task._id,
                            });
                            setShowModal(true);
                          }}
                          className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 w-full md:flex-1"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 w-full md:flex-1"
                        >
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center">
              {state === "Add" ? "Assign" : "Edit"} Employee Task
            </h2>
            <div className="space-y-2">
              <div>
                <label
                  htmlFor="projectId"
                  className="text-gray-700 font-medium mb-2"
                >
                  Select Project
                </label>
                <select
                  id="projectId"
                  value={taskDetails.projectId}
                  onChange={(e) => handleProjectChange(e.target.value)}
                  className="p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  disabled={state === "Edit"}
                >
                  <option value="">Select Project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.projectId} - {project.projectName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700">Assign Employees</label>
                <Select
                  id="assignedEmployee"
                  options={employees
                    .filter((employee) => employee.role === "User")
                    .sort((a, b) => a.employeeId - b.employeeId)
                    .map((employee) => ({
                      value: employee._id, // Pass the employee's _id here
                      label: `${employee.employeeId} - ${employee.name}`,
                    }))}
                  value={
                    taskDetails.assignedEmployee
                      ? {
                          value: taskDetails.assignedEmployee,
                          label: `${
                            employees.find(
                              (emp) => emp._id === taskDetails.assignedEmployee
                            )?.employeeId
                          } - ${
                            employees.find(
                              (emp) => emp._id === taskDetails.assignedEmployee
                            )?.name
                          }`,
                        }
                      : null
                  }
                  onChange={handleEmployeeSelectChange}
                  placeholder="Select Employee"
                  className="basic-single-select"
                  classNamePrefix="select"
                />
              </div>

              <div className="mb">
                <label
                  htmlFor="taskId"
                  className="text-gray-700 font-medium mb-2"
                >
                  Task ID
                </label>
                <input
                  id="taskId"
                  type="text"
                  value={taskDetails.taskId}
                  readOnly
                  className="p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label
                  htmlFor="taskName"
                  className="text-gray-700 font-medium mb-2"
                >
                  Task Name
                </label>
                <input
                  id="taskName"
                  type="text"
                  value={taskDetails.task}
                  onChange={(e) =>
                    setTaskDetails({ ...taskDetails, task: e.target.value })
                  }
                  className="p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label
                  htmlFor="startDate"
                  className="text-gray-700 font-medium mb-2"
                >
                  Start Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={taskDetails.startDate}
                  onChange={(e) =>
                    setTaskDetails({
                      ...taskDetails,
                      startDate: e.target.value,
                    })
                  }
                  className="p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label
                  htmlFor="dueDate"
                  className="text-gray-700 font-medium mb-2"
                >
                  Due Date
                </label>
                <input
                  id="dueDate"
                  type="date"
                  value={taskDetails.dueDate}
                  onChange={(e) =>
                    setTaskDetails({ ...taskDetails, dueDate: e.target.value })
                  }
                  className="p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="mt-4 flex flex-row gap-2">
                <button
                  onClick={state === "Add" ? handleAddTask : handleEditTask}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  {state === "Add" ? "Add Task" : "Save Changes"}
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

export default Tasks;
