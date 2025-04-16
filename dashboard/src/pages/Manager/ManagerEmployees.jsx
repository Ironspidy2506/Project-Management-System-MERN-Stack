import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ManagerContext } from "../../context/ManagerContext.jsx";

const ManagerEmployee = () => {
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
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const { mtoken } = useContext(ManagerContext);

  const roles = ["Admin", "Manager", "User"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeDetails({ ...employeeDetails, [name]: value });
  };

  const getEmployees = async () => {
    try {
      const { data } = await axios.get(
        `https://korus-pms-backend.onrender.com/api/user/get-users-manager`,
        {
          headers: { mtoken },
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
    if (mtoken) {
      getEmployees();
    }
  }, [mtoken]);

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex justify-between items-center bg-white shadow p-3 rounded-md">
        <h1 className="text-2xl font-semibold text-gray-700">
          Employee Management
        </h1>
        <div className="flex">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Add Employee
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Search by Employee ID or Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 w-full  border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Employee List */}
      <div className="mt-4">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse bg-white shadow rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-400 text-white">
                <th className="border px-6 py-3 text-center text-sm font-semibold">
                  Employee ID
                </th>
                <th className="border px-6 py-3 text-center text-sm font-semibold">
                  Name
                </th>
                <th className="border px-6 py-3 text-center text-sm font-semibold">
                  Email
                </th>
                <th className="border px-6 py-3 text-center text-sm font-semibold">
                  Department
                </th>
                <th className="border px-6 py-3 text-center text-sm font-semibold">
                  Role
                </th>
                <th className="border px-6 py-3 text-center text-sm font-semibold">
                  Phone
                </th>
                <th className="border px-6 py-3 text-center text-sm font-semibold">
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
                  <td className="border px-6 py-4 text-sm text-center text-gray-500">
                    {employee.employeeId}
                  </td>
                  <td className="border px-6 py-4 text-sm text-center text-gray-800">
                    {employee.name}
                  </td>
                  <td className="border px-6 py-4 text-sm text-center text-gray-500">
                    {employee.email}
                  </td>
                  <td className="border px-6 py-4 text-sm text-center text-gray-500">
                    {employee.department.departmentName}
                  </td>
                  <td className="border px-6 py-4 text-sm text-center text-gray-500">
                    {employee.role}
                  </td>
                  <td className="border px-6 py-4 text-sm text-center text-gray-500">
                    {employee.phone}
                  </td>
                  <td className="border px-6 py-4 flex justify-center gap-2">
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
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerEmployee;
