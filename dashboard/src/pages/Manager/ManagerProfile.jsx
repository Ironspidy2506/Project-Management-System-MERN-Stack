import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { ManagerContext } from "../../context/ManagerContext.jsx";

const ManagerProfile = () => {
  const [profile, setProfile] = useState({});
  const { mtoken } = useContext(ManagerContext);

  const getProfile = async () => {
    try {
      const { data } = await axios.get(
        `https://korus-pms.onrender.com/api/user/get-my-profile`,
        {
          headers: { mtoken },
        }
      );

      setProfile(data.user);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    if (mtoken) {
      getProfile();
    }
  }, [mtoken]);

  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex justify-between items-center bg-white shadow p-4 rounded-md">
        <h1 className="text-2xl font-semibold text-gray-700">My Profile</h1>
      </header>
      <div className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Employee ID */}
          <div className="p-4 bg-gray-50 rounded-lg shadow">
            <p className="text-sm text-gray-500">Employee ID</p>
            <p className="font-semibold text-gray-800">
              {profile.employeeId || "N/A"}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg shadow">
            <p className="text-sm text-gray-500">Employee Name</p>
            <p className="font-semibold text-gray-800">
              {profile.name || "N/A"}
            </p>
          </div>

          {/* Email */}
          <div className="p-4 bg-gray-50 rounded-lg shadow">
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold text-gray-800">
              {profile.email || "N/A"}
            </p>
          </div>

          {/* Phone */}
          <div className="p-4 bg-gray-50 rounded-lg shadow">
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-semibold text-gray-800">
              {profile.phone || "N/A"}
            </p>
          </div>

          {/* Department */}
          <div className="p-4 bg-gray-50 rounded-lg shadow">
            <p className="text-sm text-gray-500">Department</p>
            <p className="font-semibold text-gray-800">
              {profile.department?.departmentName || "N/A"}
            </p>
          </div>

          {/* Branch */}
          <div className="p-4 bg-gray-50 rounded-lg shadow">
            <p className="text-sm text-gray-500">Branch</p>
            <p className="font-semibold text-gray-800">
              {profile.branch || "N/A"}
            </p>
          </div>

          {/* Role */}
          <div className="p-4 bg-gray-50 rounded-lg shadow">
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-semibold text-gray-800">
              {profile.role || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerProfile;
