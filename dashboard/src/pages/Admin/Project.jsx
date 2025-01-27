import React, { useState, useEffect, useContext } from "react";
import { AdminContext } from "../../context/AdminContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";

const Project = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [state, setState] = useState("Add");
  const [projectDetails, setProjectDetails] = useState({
    name: "",
    description: "",
    deadline: "",
    projectId: "",
    projectName: "",
    projectPassword: "",
    remark: "",
    estimatedCost: "",
    estimatedHours: "",
    assignedManager: [],
    assignedTeamLeads: [],
    assignedResources: [],
  });

  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const { atoken } = useContext(AdminContext);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (state === "Edit") {
        const { data } = await axios.post(
          `http://localhost:5000/api/projects/edit-project/${projectDetails._id}`,
          projectDetails,
          {
            headers: { atoken },
          }
        );
        if (data.success) {
          toast.success("Project updated successfully");
          getProjects();
        } else {
          toast.error(data.error);
        }
      } else {
        const { data } = await axios.post(
          `http://localhost:5000/api/projects/add-project`,
          projectDetails,
          {
            headers: { atoken },
          }
        );
        if (data.success) {
          toast.success("Project added successfully");
          getProjects();
        } else {
          toast.error(data.error);
        }
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (projectId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:5000/api/projects/delete-project/${projectId}`,
        {
          headers: { atoken },
        }
      );
      if (data.success) {
        toast.success("Project deleted successfully");
        getProjects();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getProjects = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/projects/get-projects`,
        {
          headers: { atoken },
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

  const getEmployees = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/user/get-users`,
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

  const resetForm = () => {
    setProjectDetails({
      name: "",
      description: "",
      deadline: "",
      projectId: "",
      projectName: "",
      projectPassword: "",
      remark: "",
      estimatedCost: "",
      estimatedHours: "",
      assignedManager: [],
      assignedTeamLeads: [],
      assignedResources: [],
    });
    setState("Add");
  };

  const handleEditButtonClick = (project) => {
    // Get the assigned manager objects
    const assignedManager = employees.filter((emp) =>
      project.assignedManager?.some((empId) => emp._id === empId)
    );

    // Get the assigned team leads objects
    const assignedTeamLeads = employees.filter((emp) =>
      project.assignedTeamLeads?.some((empId) => emp._id === empId)
    );

    // Get the assigned resources objects
    const assignedResources = employees.filter((emp) =>
      project.assignedResources?.some((empId) => emp._id === empId)
    );

    console.log({ assignedManager, assignedTeamLeads, assignedResources });

    // Set project details for editing, passing the full employee objects
    setProjectDetails({
      _id: project._id,
      name: project.name,
      description: project.description,
      deadline: project.deadline,
      projectId: project.projectId,
      projectName: project.projectName,
      projectPassword: project.projectPassword,
      remark: project.remark,
      estimatedCost: project.estimatedCost,
      estimatedHours: project.estimatedHours,
      assignedManager, // Now it's the full objects
      assignedTeamLeads, // Now it's the full objects
      assignedResources, // Now it's the full objects
    });

    // Change state to 'Edit' and open the modal
    setState("Edit");
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (atoken) {
      getProjects();
      getEmployees();
    }
  }, [atoken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectDetails({ ...projectDetails, [name]: value });
  };

  // For Select Input (assignedManager, assignedTeamLeads, assignedResources)
  const handleSelectChange = (e, field) => {
    const selectedId = e.target.value;
    const selectedEmployee = employees.find((emp) => emp._id === selectedId);

    if (
      selectedEmployee &&
      !projectDetails[field].some((item) => item._id === selectedEmployee._id)
    ) {
      setProjectDetails((prev) => ({
        ...prev,
        [field]: [...prev[field], selectedEmployee],
      }));
    }
  };

  // Remove selected items from assigned fields
  const handleRemoveEmployee = (field, employee) => {
    setProjectDetails((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item._id !== employee._id),
    }));
  };

  const [selectedProject, setSelectedProject] = useState(null);
  const [modalType, setModalType] = useState("");

  const handleViewDetails = (project, type) => {
    // Map the employee details (name, employeeId) for each role
    const assignedManagerDetails = project.assignedManager.map((empId) => {
      const employee = employees.find((emp) => emp._id === empId);
      return { name: employee?.name, employeeId: employee?.employeeId };
    });

    const assignedTeamLeadsDetails = project.assignedTeamLeads.map((empId) => {
      const employee = employees.find((emp) => emp._id === empId);
      return { name: employee?.name, employeeId: employee?.employeeId };
    });

    const assignedResourcesDetails = project.assignedResources.map((empId) => {
      const employee = employees.find((emp) => emp._id === empId);
      return { name: employee?.name, employeeId: employee?.employeeId };
    });

    // Update the selected project with employee details
    setSelectedProject({
      ...project,
      assignedManagerDetails,
      assignedTeamLeadsDetails,
      assignedResourcesDetails,
    });

    setModalType(type);
  };

  const closeModal = () => {
    setSelectedProject(null);
    setModalType("");
  };

  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex justify-between items-center bg-white shadow p-4 rounded-md">
        <h1 className="text-2xl font-semibold text-gray-700">
          Project Management
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              resetForm(); // Reset the form before opening the modal
              setIsModalOpen(true);
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Project
          </button>
        </div>
      </header>

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
                Estimated Cost
              </th>
              <th className="border border-gray-200 px-4 py-2 text-center">
                Current Cost
              </th>
              <th className="border border-gray-200 px-4 py-2 text-center">
                Estimated Hours
              </th>
              <th className="border border-gray-200 px-4 py-2 text-center">
                Consumed Hours
              </th>
              <th className="border border-gray-200 px-4 py-2 text-center">
                Status
              </th>
              <th className="border border-gray-200 px-4 py-2 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr key={index} className="hover:bg-gray-50 transition">
                <td className="border border-gray-200 px-4 py-2 text-center">
                  {project.projectId}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-center">
                  {project.projectName}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-center">
                  ₹{project.estimatedCost}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-center">
                  ₹{project.currentCost || 0}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-center">
                  {project.estimatedHours || 0}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-center">
                  {project.currentHours || 0}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-center">
                  <span className="bg-gray-300 p-2 rounded-full">
                    {project.status}
                  </span>
                </td>
                <td className="border border-gray-200 px-4 py-2 text-center">
                  <button
                    onClick={() => handleViewDetails(project)}
                    className="px-2 py-1 text-base bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEditButtonClick(project)}
                    className="px-2 py-1 text-base bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="px-2 py-1 text-base bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Viewing Combined Details */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Assigned Team Members</h3>
            <ul className="space-y-2">
              {/* Managers */}
              {selectedProject.assignedManager.length > 0 ? (
                <div>
                  <h4 className="font-semibold text-lg">Managers</h4>
                  {selectedProject.assignedManagerDetails.map(
                    (manager, index) => (
                      <li key={index} className="text-base text-gray-700">
                        {manager.employeeId} - {manager.name}
                      </li>
                    )
                  )}
                </div>
              ) : (
                <li className="text-base text-gray-700">
                  No managers assigned.
                </li>
              )}

              {/* Team Leads */}
              {selectedProject.assignedTeamLeads.length > 0 ? (
                <div>
                  <h4 className="font-semibold text-lg">Team Leads</h4>
                  {selectedProject.assignedTeamLeadsDetails.map(
                    (lead, index) => (
                      <li key={index} className="text-base text-gray-700">
                        {lead.employeeId} - {lead.name}
                      </li>
                    )
                  )}
                </div>
              ) : (
                <li className="text-base text-gray-700">
                  No team leads assigned.
                </li>
              )}

              {/* Resources */}
              {selectedProject.assignedResources.length > 0 ? (
                <div>
                  <h4 className="font-semibold text-lg">Resources</h4>
                  {selectedProject.assignedResourcesDetails.map(
                    (resource, index) => (
                      <li key={index} className="text-base text-gray-700">
                        {resource.employeeId} - {resource.name}
                      </li>
                    )
                  )}
                </div>
              ) : (
                <li className="text-base text-gray-700">
                  No resources assigned.
                </li>
              )}
            </ul>
            <div className="flex justify-center">
              <button
                onClick={closeModal}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed  inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl p-6 rounded shadow-lg relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-5 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-center text-xl font-semibold mb-4">
              {state === "Add" ? "Add New" : "Edit"} Project
            </h2>

            <form
              onSubmit={handleFormSubmit}
              className="space-y-4 max-h-[80vh] overflow-y-auto p-5"
            >
              {/* Project ID */}
              <div className="mb-4">
                <label className="block text-base font-medium mb-1">
                  Project ID
                </label>
                <input
                  type="text"
                  name="projectId"
                  value={projectDetails.projectId}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project ID"
                  required
                />
              </div>
              {/* Project Name */}
              <div className="mb-4">
                <label className="block text-base font-medium mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={projectDetails.projectName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project name"
                  required
                />
              </div>
              {/* Project Password */}
              <div className="mb-4">
                <label className="block text-base font-medium mb-1">
                  Project Password
                </label>
                <input
                  type="password"
                  name="projectPassword"
                  value={projectDetails.projectPassword}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project password"
                  required
                />
              </div>
              {/* Description */}
              <div className="mb-4">
                <label className="block text-base font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={projectDetails.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project description"
                />
              </div>
              {/* Remark */}
              <div className="mb-4">
                <label className="block text-base font-medium mb-1">
                  Remark
                </label>
                <textarea
                  name="remark"
                  value={projectDetails.remark}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter any remarks"
                />
              </div>
              {/* Estimated Cost */}
              <div className="mb-4">
                <label className="block text-base font-medium mb-1">
                  Estimated Cost
                </label>
                <input
                  type="number"
                  name="estimatedCost"
                  onWheel={(e) => e.target.blur()}
                  value={projectDetails.estimatedCost}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter estimated cost"
                />
              </div>

              <div className="mb-4">
                <label className="block text-base font-medium mb-1">
                  Estimated Hours
                </label>
                <input
                  type="number"
                  name="estimatedHours"
                  onWheel={(e) => e.target.blur()}
                  value={projectDetails.estimatedHours}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter estimated hours"
                />
              </div>
              {/* Assigned Managers */}
              <div className="mb-4">
                <label className="block text-base font-medium mb-1">
                  Assigned Manager
                </label>
                <select
                  name="assignedManager"
                  onChange={(e) => handleSelectChange(e, "assignedManager")}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Manager</option>
                  {employees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.name} ({employee.employeeId})
                    </option>
                  ))}
                </select>

                <div className="mt-4 space-y-2">
                  {projectDetails.assignedManager.map((manager) => (
                    <div
                      key={manager._id}
                      className="flex items-center justify-between bg-gray-100 p-2 rounded border"
                    >
                      <span>
                        {manager.name} ({manager.employeeId})
                      </span>
                      <button
                        onClick={() =>
                          handleRemoveEmployee("assignedManager", manager)
                        }
                        className="text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              {/* Assigned Team Leads */}
              <div className="mb-4">
                <label className="block text-base font-medium mb-1">
                  Assigned Team Leads
                </label>
                <select
                  name="teamLeads"
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selectedEmployee = employees.find(
                      (emp) => emp._id === selectedId
                    );
                    if (
                      selectedEmployee &&
                      !projectDetails.assignedTeamLeads.some(
                        (lead) => lead._id === selectedEmployee._id
                      )
                    ) {
                      setProjectDetails((prev) => ({
                        ...prev,
                        assignedTeamLeads: [
                          ...prev.assignedTeamLeads,
                          selectedEmployee,
                        ],
                      }));
                    }
                  }}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Team Lead</option>
                  {employees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.name} ({employee.employeeId})
                    </option>
                  ))}
                </select>

                {/* Display Selected Team Leads */}
                <div className="mt-4 space-y-2">
                  {projectDetails.assignedTeamLeads.map((lead) => (
                    <div
                      key={lead._id}
                      className="flex items-center justify-between bg-gray-100 p-2 rounded border"
                    >
                      <span>
                        {lead.name} ({lead.employeeId})
                      </span>
                      <button
                        onClick={() =>
                          handleRemoveEmployee("assignedTeamLeads", lead)
                        }
                        className="text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              {/* Assigned Resources */}
              <div className="mb-4">
                <label className="block text-base font-medium mb-1">
                  Assigned Resources
                </label>
                <select
                  name="resources"
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selectedEmployee = employees.find(
                      (emp) => emp._id === selectedId
                    );
                    if (
                      selectedEmployee &&
                      !projectDetails.assignedResources.some(
                        (resource) => resource._id === selectedEmployee._id
                      )
                    ) {
                      setProjectDetails((prev) => ({
                        ...prev,
                        assignedResources: [
                          ...prev.assignedResources,
                          selectedEmployee,
                        ],
                      }));
                    }
                  }}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Resource</option>
                  {employees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.name} ({employee.employeeId})
                    </option>
                  ))}
                </select>

                {/* Display Selected Resources */}
                <div className="mt-4 space-y-2">
                  {projectDetails.assignedResources.map((resource) => (
                    <div
                      key={resource._id}
                      className="flex items-center justify-between bg-gray-100 p-2 rounded border"
                    >
                      <span>
                        {resource.name} ({resource.employeeId})
                      </span>
                      <button
                        onClick={() =>
                          handleRemoveEmployee("assignedResources", resource)
                        }
                        className="text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;
