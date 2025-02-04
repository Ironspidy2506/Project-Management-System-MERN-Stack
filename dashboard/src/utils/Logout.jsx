import { toast } from "react-toastify";

export const logout = async (
  navigate,
  atoken,
  setAToken,
  mtoken,
  setMToken,
  token,
  setToken
) => {
  const logId = localStorage.getItem("currentLogId");

  if (logId) {
    try {
      const { data } = await axios.post(
        `https://korus-pms.onrender.com/api/project-log/end-project`,
        {
          logId,
          endTime: Date.now(),
        },
        {
          headers: { token },
        }
      );

      if (data.success) {
        toast.success("Project ended successfully.");
        localStorage.removeItem("currentLogId");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error ending project:", error);
      toast.error(error.response?.data?.message || "Failed to end project.");
    }
  }

  // Proceed with logout
  navigate("/");
  if (atoken) {
    setAToken("");
    localStorage.removeItem("atoken");
  }
  if (mtoken) {
    setMToken("");
    localStorage.removeItem("mtoken");
  }
  if (token) {
    setToken("");
    localStorage.removeItem("token");
  }
};
