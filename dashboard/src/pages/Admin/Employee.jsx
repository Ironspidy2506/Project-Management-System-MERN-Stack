import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext.jsx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Employee = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState({
    employeeId: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    department: "",
    branch: "",
    role: "User",
  });
  const [state, setState] = useState("Add");
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const { atoken } = useContext(AdminContext);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  const roles = ["Admin", "Manager", "User"]; // Role options for dropdown

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeDetails({ ...employeeDetails, [name]: value });
  };

  const getEmployees = async () => {
    try {
      const { data } = await axios.get(
        `https://project-management-system-mern-stack.vercel.app/api/user/get-users`,
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

  useEffect(() => {
    if (atoken) {
      getEmployees();
    }
  }, [atoken]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (state === "Add") {
      try {
        const { data } = await axios.post(
          `https://project-management-system-mern-stack.vercel.app/api/user/add-user`,
          employeeDetails,
          {
            headers: { atoken },
          }
        );

        if (data.success) {
          toast.success(data.message);
          getEmployees();
        } else {
          toast.error(data.error);
        }
      } catch (error) {
        toast.error(error.message);
      }
    } else if (state === "Edit") {
      try {
        const { data } = await axios.post(
          `https://project-management-system-mern-stack.vercel.app/api/user/edit-user/${employeeDetails._id}`,
          employeeDetails,
          {
            headers: { atoken },
          }
        );

        if (data.success) {
          toast.success(data.message);
          getEmployees();
        } else {
          toast.error(data.error);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }

    setState("Add");
    setIsModalOpen(false);
    setEmployeeDetails({
      employeeId: "",
      name: "",
      email: "",
      password: "",
      phone: "",
      department: "",
      branch: "",
      role: "User",
    });
  };

  const handleDeleteEmployee = async (_id) => {
    try {
      const { data } = await axios.delete(
        `https://project-management-system-mern-stack.vercel.app/api/user/delete-user/${_id}`,
        {
          headers: { atoken },
        }
      );
      if (data.success) {
        toast.success(data.message);
        getEmployees();
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
        {
          headers: { atoken },
        }
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

  useEffect(() => {
    if (atoken) {
      getDepartments();
    }
  }, [atoken]);

  const handleEditButtonClick = (employee) => {
    setEmployeeDetails({
      _id: employee._id,
      employeeId: employee.employeeId,
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department._id,
      branch: employee.branch,
      role: employee.role,
    });
    setState("Edit");
    setIsModalOpen(true);
  };

  // Filter employees by search query (employeeId or name)
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      employees.map((emp) => ({
        "Employee ID": emp.employeeId,
        Name: emp.name,
        Email: emp.email,
        Department: emp.department.departmentName,
        Branch: emp.branch,
        Role: emp.role,
        Phone: emp.phone,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "employees.xlsx");
  };

  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex justify-between items-center bg-white shadow p-4 rounded-md">
        <h1 className="text-2xl font-semibold text-gray-700">
          Employee Management
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Add Employee
          </button>
          <button
            onClick={exportToExcel}
            className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition-all"
          >
            Export to Excel
          </button>
        </div>
      </header>

      {/* Search Input */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Search by Employee ID or Name"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Employee List */}
      <div className="mt-4">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse bg-white shadow rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-400 text-white">
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Name
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Email
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Department
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Role
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Phone
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee, index) => (
                <tr
                  key={employee._id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  <td className="px-6 py-4 text-sm text-center text-gray-500">
                    {employee.employeeId}
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-800">
                    {employee.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-500">
                    {employee.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-500">
                    {employee.department.departmentName}
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-500">
                    {employee.role}
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-500">
                    {employee.phone}
                  </td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button
                      onClick={() => handleEditButtonClick(employee)}
                      className="px-4 py-2 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEmployee(employee._id)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl p-6 rounded shadow-lg relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-5 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-center text-xl font-semibold mb-4">
              {state === "Add" ? "Add New Employee" : "Edit Employee"}
            </h2>

            <form
              onSubmit={handleFormSubmit}
              className="space-y-4 max-h-[80vh] overflow-y-auto p-5"
            >
              {/* Employee ID */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Employee ID
                </label>
                <input
                  type="text"
                  name="employeeId"
                  value={employeeDetails.employeeId}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter employee ID"
                  required
                />
              </div>

              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={employeeDetails.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter employee name"
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={employeeDetails.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                  required
                />
              </div>

              {/* Password */}
              {state === "Add" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={employeeDetails.password}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter password"
                    required
                  />
                </div>
              )}

              {/* Phone */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={employeeDetails.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Department */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Department
                </label>
                <select
                  name="department"
                  value={employeeDetails.department}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.departmentName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Branch */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Branch</label>
                <input
                  type="text"
                  name="branch"
                  value={employeeDetails.branch}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter branch"
                  required
                />
              </div>

              {/* Role */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  name="role"
                  value={employeeDetails.role}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {state === "Add" ? "Add Employee" : "Update Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employee;
