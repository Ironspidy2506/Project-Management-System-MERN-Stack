import Performance from "../models/Performance.js";
import User from "../models/Users.js";
import Project from "../models/Project.js";

// API to get all performances
const getAllPerformances = async (req, res) => {
  try {
    const performances = await Performance.find({}).populate(
      "project user drawingReleased"
    );

    return res.json({
      success: true,
      message: "Performances data fetched successfully",
      performances,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to add performance for user
const addPerformance = async (req, res) => {
  try {
    const {
      userId,
      projectId,
      performanceId,
      drawingType,
      drawingReleased,
      drawings,
      date,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.json({
        success: false,
        message: "Project not found",
      });
    }

    const newPerformance = new Performance({
      performanceId,
      project: project._id,
      user: user._id,
      drawingType,
      drawingReleased,
      drawings,
      date,
    });

    await newPerformance.save();

    res.json({
      success: true,
      message: "Performance added successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to edit performance for user
const editPerformance = async (req, res) => {
  try {
    const { _id } = req.params;
    const { drawingType, date, drawingReleased, drawings } = req.body;

    const updatedPerformance = await Performance.findByIdAndUpdate(
      _id,
      {
        drawingType,
        date,
        drawingReleased,
        drawings,
      },
      { new: true }
    );

    if (!updatedPerformance) {
      return res.json({
        success: false,
        message: "Performance not found or could not be updated",
      });
    }

    res.json({
      success: true,
      message: "Performance updated successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to delete the performance
const deletePerformance = async (req, res) => {
  try {
    const { _id } = req.params;

    const deletedPerformance = await Performance.findByIdAndDelete(_id);
    if (!deletedPerformance) {
      return res.json({ success: false, error: "Performance not found" });
    }

    res.json({ success: true, message: "Performance deleted successfully" });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

// API to get date-wise performances for user
const getDateWisePerformanceUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const { date } = req.params;

    const performances = await Performance.find({
      user: userId,
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

const getMonthWisePerformanceUser = async (req, res) => {
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
      user: userId,
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

export {
  getAllPerformances,
  addPerformance,
  editPerformance,
  deletePerformance,
  getDateWisePerformanceUser,
  getMonthWisePerformanceUser,
};
