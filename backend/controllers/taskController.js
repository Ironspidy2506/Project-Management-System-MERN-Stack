import Task from "../models/Tasks.js";
import User from "../models/Users.js";
import Project from "../models/Project.js";

// API to Add the task
const addTask = async (req, res) => {
  try {
    const { userId, projectId, taskId, task, startDate, dueDate } = req.body;

    // Validate dueDate
    if (new Date(dueDate) < new Date(startDate)) {
      return res.json({
        success: false,
        message: "Due date must be on or after the start date",
      });
    }

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

    const newTask = new Task({
      taskId,
      project: project._id,
      user: user._id,
      task,
      startDate,
      dueDate,
      added: true,
    });

    await newTask.save();

    res.json({
      success: true,
      message: "Task added successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to Edit the task
const editTask = async (req, res) => {
  try {
    const { _id } = req.params;
    const { task, startDate, dueDate } = req.body;

    // Validate dueDate
    if (new Date(dueDate) < new Date(startDate)) {
      return res.json({
        success: false,
        message: "Due date must be on or after the start date",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      _id,
      {
        task,
        startDate,
        dueDate,
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.json({
        success: false,
        message: "Task not found or could not be updated",
      });
    }

    res.json({
      success: true,
      message: "Task updated successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to Delete the task
const deleteTask = async (req, res) => {
  try {
    const { _id } = req.params;

    const deletedTask = await Task.findByIdAndDelete(_id);
    if (!deletedTask) {
      return res.json({ success: false, error: "Task not found" });
    }

    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

// API to complete the task
const completeTask = async (req, res) => {
  try {
    const { _id } = req.params;
    const { status } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      _id,
      {
        status,
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.json({
        success: false,
        message: "Task not found or could not be updated",
      });
    }

    res.json({
      success: true,
      message: "Task completed successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to get date-wise tasks for user
const getDateWiseTaskUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const { date } = req.params;

    const tasks = await Task.find({
      user: userId,
      startDate: date,
    }).populate("project");

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

// API to get month-wise tasks for user
const getMonthWiseTaskUser = async (req, res) => {
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
      user: userId,
      startDate: {
        $gte: startDate,
        $lt: endDate,
      },
    }).populate("project");

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

export {
  addTask,
  editTask,
  deleteTask,
  completeTask,
  getDateWiseTaskUser,
  getMonthWiseTaskUser,
};
