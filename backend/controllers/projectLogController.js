import bcrypt from "bcrypt";
import ProjectLog from "../models/ProjectLog.js";
import User from "../models/Users.js";
import Project from "../models/Project.js";

const getAllLogs = async (req, res) => {
  try {
    const logs = await ProjectLog.find({}).populate("project user");

    return res.json({
      success: true,
      message: "Logs data fetched successfully",
      logs,
    });
  } catch (error) {
    console.error("Error fetching project logs:", error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const startProject = async (req, res) => {
  try {
    const { userId, projectId, projectPassword, startDate, startTime } =
      req.body;

    const startTimestamp = new Date(`${startDate}T${startTime}:00.000Z`);

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const project = await Project.findOne({ projectId: projectId });
    if (!project) {
      return res.json({ success: false, message: "Project not found" });
    }

    const isMatch = project.projectPassword === projectPassword;
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Incorrect Project Password",
      });
    }

    const projectLog = new ProjectLog({
      project: project._id,
      user: user._id,
      startTime: startTimestamp,
    });

    await projectLog.save();

    return res.json({
      success: true,
      message: "Time capturing started successfully",
      logId: projectLog._id,
    });
  } catch (error) {
    console.error("Error starting the project:", error);
    return res.json({
      success: false,
      message: "An error occurred while starting the project",
    });
  }
};

const endProject = async (req, res) => {
  try {
    const { logId, endDate, endTime } = req.body;

    const endTimestamp = new Date(`${endDate}T${endTime}:00.000Z`);

    const projectLog = await ProjectLog.findById(logId);
    if (!projectLog) {
      return res.json({
        success: false,
        message: "Project log not found",
      });
    }

    const totalTime = (
      (endTimestamp - projectLog.startTime) /
      (1000 * 60 * 60)
    ).toFixed(2);

    projectLog.endTime = endTimestamp;
    projectLog.totalTime = totalTime;

    await projectLog.save();

    return res.json({
      success: true,
      message: "Time capturing ended successfully",
    });
  } catch (error) {
    console.error("Error ending the project:", error);
    return res.json({
      success: false,
      message: "An error occurred while ending the project",
    });
  }
};

const getUserProjectLogs = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const projectlogs = await ProjectLog.find({
      user: user._id,
    }).populate("project user");

    return res.json({
      success: true,
      projectlogs,
      message: "Project logs fetched",
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const addProjectLog = async (req, res) => {
  try {
    const { projectId, userId, startDate, startTime, endDate, endTime } =
      req.body;

    if (
      !projectId ||
      !userId ||
      !startDate ||
      !startTime ||
      !endDate ||
      !endTime
    ) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const startTimestamp = new Date(`${startDate}T${startTime}:00.000Z`);
    const endTimestamp = new Date(`${endDate}T${endTime}:00.000Z`);

    if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
      return res.json({
        success: false,
        message: "Invalid date or time format",
      });
    }

    const totalTime = (
      (endTimestamp - startTimestamp) /
      (1000 * 60 * 60)
    ).toFixed(2);

    if (totalTime < 0) {
      return res.json({
        success: false,
        message: "End time cannot be before start time",
      });
    }

    const newLog = new ProjectLog({
      project: projectId,
      user: userId,
      startTime: startTimestamp,
      endTime: endTimestamp,
      totalTime: parseFloat(totalTime),
      added: true,
    });

    await newLog.save();

    res.json({ success: true, message: "Log added successfully" });
  } catch (error) {
    console.error("Error adding project log:", error);
    res.json({ success: false, message: "Internal server error" });
  }
};

const editProjectLog = async (req, res) => {
  try {
    const { logId } = req.params;
    const { startDate, startTime, endDate, endTime } = req.body;

    if (!startDate || !startTime || !endDate || !endTime) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const startTimestamp = new Date(`${startDate}T${startTime}:00.000Z`);
    const endTimestamp = new Date(`${endDate}T${endTime}:00.000Z`);

    if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
      return res.json({
        success: false,
        message: "Invalid date or time format",
      });
    }

    const totalTime = (
      (endTimestamp - startTimestamp) /
      (1000 * 60 * 60)
    ).toFixed(2);

    if (totalTime < 0) {
      return res.json({
        success: false,
        message: "End time cannot be before start time",
      });
    }

    await ProjectLog.findByIdAndUpdate(
      logId,
      {
        startTime: startTimestamp,
        endTime: endTimestamp,
        totalTime: parseFloat(totalTime),
      },
      { new: true }
    );

    res.json({ success: true, message: "Log updated successfully" });
  } catch (error) {
    console.error("Error adding project log:", error);
    res.json({ success: false, message: "Internal server error" });
  }
};

const deleteProjectLog = async (req, res) => {
  try {
    const { logId } = req.params;

    await ProjectLog.findByIdAndDelete(logId);

    res.json({ success: true, message: "Log deleted successfully" });
  } catch (error) {
    console.error("Error adding project log:", error);
    res.json({ success: false, message: "Internal server error" });
  }
};

// API to get date-wise project-logs for user
const getDateWiseProjectLogUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const { date } = req.params;

    const parsedDate = new Date(date + "T00:00:00+00:00");

    // If invalid date is passed
    if (isNaN(parsedDate)) {
      return res.json({
        success: false,
        message: "Invalid date format. Please use yyyy-mm-dd format.",
      });
    }

    const startOfDay = new Date(parsedDate);

    const endOfDay = new Date(parsedDate);
    endOfDay.setHours(28, 89, 59, 999);

    const logs = await ProjectLog.find({
      user: userId,
      startTime: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    }).populate("project");

    if (logs.length === 0) {
      return res.json({
        success: false,
        message: "No project logs found for the given date.",
      });
    }

    return res.json({
      success: true,
      message: `Project Log data fetched for ${date}`,
      logs,
    });
  } catch (error) {
    console.error("Error fetching project logs:", error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to get month-wise project-logs for user
const getMonthWiseProjectLogUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const { month, year } = req.params;

    if (!month || !year) {
      return res.json({
        success: false,
        message: "Month and Year are required",
      });
    }

    const monthNumber = parseInt(month, 10) - 1;
    const yearNumber = parseInt(year, 10);

    const startOfMonth = new Date(yearNumber, monthNumber, 1);
    startOfMonth.setHours(5, 30, 0, 0);

    const endOfMonth = new Date(yearNumber, monthNumber + 1, 0);
    endOfMonth.setHours(28, 89, 59, 999);

    const logs = await ProjectLog.find({
      user: userId,
      startTime: {
        $gte: startOfMonth,
        $lt: endOfMonth,
      },
    }).populate("project");

    return res.json({
      success: true,
      message: `Project Log data fetched desired month`,
      logs,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//  Get employee project logs
const getEmployeeProjectLogs = async (req, res) => {
  try {
    const logs = await ProjectLog.find({}).populate("project user");

    res.json({
      success: true,
      logs,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getAllLogs,
  startProject,
  endProject,
  getUserProjectLogs,
  addProjectLog,
  editProjectLog,
  deleteProjectLog,
  getDateWiseProjectLogUser,
  getMonthWiseProjectLogUser,
  getEmployeeProjectLogs,
};
