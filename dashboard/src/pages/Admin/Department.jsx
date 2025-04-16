import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext.jsx";

const Department = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departmentDetails, setDepartmentDetails] = useState({
    departmentId: "",
    departmentName: "",
    description: "",
    isManagement: false,
  });
  const [state, setState] = useState("Add");
  const [departments, setDepartments] = useState([]);
  const { atoken } = useContext(AdminContext);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDepartmentDetails({ ...departmentDetails, [name]: value });
  };

  const handleToggleChange = () => {
    setDepartmentDetails((prevDetails) => ({
      ...prevDetails,
      isManagement: !prevDetails.isManagement,
    }));
  };

  const getDepartments = async () => {
    try {
      const { data } = await axios.get(
        `https://korus-pms-backend.onrender.com/api/department/get-departments`,
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
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (state === "Add") {
      try {
        const { data } = await axios.post(
          `https://korus-pms-backend.onrender.com/api/department/add-department`,
          departmentDetails,
          {
            headers: { atoken },
          }
        );

        if (data.success) {
          toast.success(data.message);
          getDepartments(); // Refresh the department list
        } else {
          toast.error(data.error);
        }
      } catch (error) {
        toast.error(error.message);
      }
    } else if (state === "Edit") {
      try {
        const { data } = await axios.post(
          `https://korus-pms-backend.onrender.com/api/department/edit-department/${departmentDetails._id}`,
          departmentDetails,
          {
            headers: { atoken },
          }
        );

        if (data.success) {
          toast.success(data.message);
          getDepartments(); // Refresh the department list
        } else {
          toast.error(data.error);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }

    // Reset the modal state and department details
    setState("Add");
    setIsModalOpen(false);
    setDepartmentDetails({
      departmentId: "",
      departmentName: "",
      description: "",
      isManagement: false,
    });
  };

  const handleDeleteDepartment = async (_id) => {
    try {
      const { data } = await axios.delete(
        `https://korus-pms-backend.onrender.com/api/department/delete-department/${_id}`,
        {
          headers: { atoken },
        }
      );
      if (data.success) {
        toast.success(data.message);
        getDepartments();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleEditButtonClick = (department) => {
    setDepartmentDetails({
      _id: department._id,
      departmentId: department.departmentId,
      departmentName: department.departmentName,
      description: department.description,
      isManagement: department.isManagement,
    });
    setState("Edit");
    setIsModalOpen(true);
  };

  const filteredDepartments = departments.filter(
    (department) =>
      department.departmentId
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      department.departmentName
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex justify-between items-center bg-white shadow p-4 rounded-md">
        <h1 className="text-2xl font-semibold text-gray-700">
          Department Management
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Add Department
          </button>
        </div>
      </header>

      {/* Search Input */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Search by Department ID or Name"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Department List */}
      <div className="mt-4">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse bg-white shadow rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-400 text-white">
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Department ID
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Department Name
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Management
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map((department, index) => (
                <tr
                  key={department._id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  <td className="px-6 py-4 text-sm text-center text-gray-500">
                    {department.departmentId}
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-800">
                    {department.departmentName}
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-500">
                    {department.isManagement ? "Yes" : "No"}
                  </td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button
                      onClick={() => handleEditButtonClick(department)}
                      className="px-4 py-2 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDepartment(department._id)}
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
              Add New Department
            </h2>

            <form
              onSubmit={handleFormSubmit}
              className="space-y-4 max-h-[80vh] overflow-y-auto p-5"
            >
              {/* Department ID */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Department ID
                </label>
                <input
                  type="text"
                  name="departmentId"
                  value={departmentDetails.departmentId}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter department ID"
                  required
                />
              </div>

              {/* Department Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Department Name
                </label>
                <input
                  type="text"
                  name="departmentName"
                  value={departmentDetails.departmentName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter department name"
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={departmentDetails.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter department description"
                />
              </div>

              {/* Management Department Toggle */}
              <div className="mb-4 flex items-center">
                <label className="block text-sm font-medium mr-2">
                  Is Management Department?
                </label>
                <input
                  type="checkbox"
                  checked={departmentDetails.isManagement}
                  onChange={handleToggleChange}
                  className="h-5 w-5"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {state === "Add" ? "Add Department" : "Edit Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Department;
