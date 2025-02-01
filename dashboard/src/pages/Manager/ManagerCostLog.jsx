import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ManagerContext } from "../../context/ManagerContext.jsx";
import { toast } from "react-toastify";

const ManagerCostLog = () => {
  const { mtoken } = useContext(ManagerContext);
  const [costs, setCosts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedCost, setEditedCost] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // New state for the search term

  useEffect(() => {
    if (mtoken) {
      getCosts();
    }
  }, [mtoken]);

  const getCosts = async () => {
    try {
      const { data } = await axios.get(
        `https://korus-pms.onrender.com/api/cost/get-cost-added-by-manager`,
        {
          headers: { mtoken },
        }
      );

      if (data.success) {
        setCosts(data.costs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }
  };

  const handleEdit = (cost) => {
    setEditingId(cost._id);
    setEditedCost({ costName: cost.costName, costAmount: cost.costAmount });
  };

  const handleSave = async (costId) => {
    try {
      const { data } = await axios.post(
        `https://korus-pms.onrender.com/api/cost/edit-cost-manager/${costId}`,
        editedCost,
        { headers: { mtoken } }
      );

      if (data.success) {
        toast.success(data.message);
        getCosts();
        setEditingId(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred while updating."
      );
    }
  };

  const handleDelete = async (costId) => {
    try {
      const { data } = await axios.delete(
        `https://korus-pms.onrender.com/api/cost/delete-cost-manager/${costId}`,
        { headers: { mtoken } }
      );

      if (data.success) {
        toast.success(data.message);
        getCosts();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred while deleting."
      );
    }
  };

  // Filter the costs based on the search term
  const filteredCosts = costs.filter(
    (cost) =>
      cost.project?.projectId
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      cost.project?.projectName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      cost.costId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="p-6">
        {/* Header */}
        <header className="flex justify-between items-center bg-white shadow py-4 px-3 rounded-md">
          <h1 className="text-2xl font-semibold text-gray-700">
            Projects Cost Management
          </h1>
        </header>

        {/* Search Bar */}
        <div className="mt-6 flex items-center">
          <input
            type="text"
            placeholder="Search by Project ID, Name, or Cost ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Project Table */}
        <div className="mt-4 overflow-x-auto">
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
                  Cost ID
                </th>
                <th className="border border-gray-200 px-4 py-2 text-center">
                  Cost Name
                </th>
                <th className="border border-gray-200 px-4 py-2 text-center">
                  Cost Amount
                </th>
                <th className="border border-gray-200 px-4 py-2 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCosts.map((cost, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {cost.project?.projectId}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {cost.project?.projectName}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {cost.costId}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {editingId === cost._id ? (
                      <input
                        type="text"
                        value={editedCost.costName}
                        onChange={(e) =>
                          setEditedCost({
                            ...editedCost,
                            costName: e.target.value,
                          })
                        }
                        className="border p-1 text-center w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      cost.costName
                    )}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {editingId === cost._id ? (
                      <input
                        type="number"
                        value={editedCost.costAmount}
                        onChange={(e) =>
                          setEditedCost({
                            ...editedCost,
                            costAmount: e.target.value,
                          })
                        }
                        onWheel={(e) => e.target.blur()}
                        className="border p-1 text-center w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      `₹${cost.costAmount}`
                    )}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    <div className="flex flew-row">
                      {editingId === cost._id ? (
                        <button
                          onClick={() => handleSave(cost._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 flex-1"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(cost)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 flex-1"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(cost._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md ml-2 hover:bg-red-600 flex-1"
                      >
                        Delete
                      </button>
                    </div>
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

export default ManagerCostLog;
