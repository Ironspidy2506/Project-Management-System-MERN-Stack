import User from "../models/Users.js";
import Project from "../models/Project.js";
import Task from "../models/Tasks.js";
import Performance from "../models/Performance.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const getManagerAssignedTasks = async (req, res) => {
  try {
    const { userId } = req.body;

    const tasks = await Task.find({ assignedBy: userId })
      .populate("project")
      .populate("user");

    return res.json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    return res.json({
      success: false,
      error: "Failed to fetch tasks. Please try again later.",
    });
  }
};

// API to get date-wise tasks for user
const getDateWiseTaskUserManager = async (req, res) => {
  try {
    const { userId } = req.body;
    const { date } = req.params;

    const tasks = await Task.find({
      assignedBy: userId,
      startDate: date,
    })
      .populate("project")
      .populate("user");

    return res.json({
      success: true,
      message: `Task data fetched for ${date}`,
      tasks,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to get date-wise tasks for user
const getEmployeeWiseTasksManager = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const user = await User.findOne({ employeeId: employeeId });

    const tasks = await Task.find({
      user: user._id,
    })
      .populate("project")
      .populate("user");

    return res.json({
      success: true,
      message: `Task data fetched for ${employeeId}`,
      tasks,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to get month-wise tasks for user
const getMonthWiseTaskUserManager = async (req, res) => {
  try {
    const { userId } = req.body;
    const { month, year } = req.params;

    if (!month || !year) {
      return res.json({
        success: false,
        message: "Month and Year are required",
      });
    }

    const monthNumber = parseInt(month, 10);
    const yearNumber = parseInt(year, 10);

    const startDate = new Date(yearNumber, monthNumber - 1, 1);
    const endDate = new Date(yearNumber, monthNumber, 1);

    const tasks = await Task.find({
      assignedBy: userId,
      startDate: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .populate("project")
      .populate("user");

    res.json({
      success: true,
      message: `Tasks fetched successfully`,
      tasks,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to get employee performances for viewing
const getEmployeeWisePerformancesManager = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const user = await User.findOne({ employeeId: employeeId });

    const performances = await Performance.find({ user: user._id })
      .populate("drawingReleased")
      .populate("project")
      .populate("user");

    return res.json({
      message: `Performance data fetched for Employee ID: ${employeeId}`,
      success: true,
      performances,
    });
  } catch (error) {
    console.error("Error fetching performances:", error.message);
    return res.json({
      success: false,
      error: "Failed to fetch performances. Please try again later.",
    });
  }
};

// API to get all employees performance for manager approval
const getAllEmployeesPerformancesForManager = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const performances = await Performance.find({
      drawingReleased: user._id,
    }).populate("project user drawingReleased");

    return res.json({
      success: true,
      message: "Performances data fetched",
      performances,
    });
  } catch (error) {
    console.error("Error fetching performances:", error.message);
    return res.json({
      success: false,
      error: "Failed to fetch performances. Please try again later.",
    });
  }
};

// API to get date-wise performances of user for manager
const getDateWisePerformanceUserManager = async (req, res) => {
  try {
    const { userId } = req.body;
    const { date } = req.params;

    const performances = await Performance.find({
      drawingReleased: userId,
      date,
    })
      .populate("drawingReleased")
      .populate("project")
      .populate("user");

    return res.json({
      success: true,
      message: `Performance data fetched for ${date}`,
      performances,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to get month wise performance of user for manager
const getMonthWisePerformanceUserManager = async (req, res) => {
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

    const startDate = new Date(yearNumber, monthNumber, 1);
    const endDate = new Date(yearNumber, monthNumber + 1, 1);

    const performances = await Performance.find({
      drawingReleased: userId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .populate("drawingReleased")
      .populate("project")
      .populate("user");

    res.json({
      success: true,
      message: `Performances fetched successfully`,
      performances,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const changeStatusOfPerformance = async (req, res) => {
  try {
    const { performanceId } = req.params;
    const { status } = req.body;

    await Performance.findByIdAndUpdate(
      performanceId,
      { status },
      { new: true }
    );

    return res.json({
      success: true,
      message: `Performance ${status} successfully`,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getManagerAssignedTasks,
  getDateWiseTaskUserManager,
  getMonthWiseTaskUserManager,
  getEmployeeWiseTasksManager,
  getEmployeeWisePerformancesManager,
  getAllEmployeesPerformancesForManager,
  getDateWisePerformanceUserManager,
  getMonthWisePerformanceUserManager,
  changeStatusOfPerformance
};
