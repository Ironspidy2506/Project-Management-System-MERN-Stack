import bcrypt from "bcrypt";
import ProjectLog from "../models/ProjectLog.js";
import User from "../models/Users.js";
import Project from "../models/Project.js";

const startProject = async (req, res) => {
  try {
    const { userId, projectId, projectPassword, startTime } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const project = await Project.findOne({ projectId: projectId });
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const isMatch = project.projectPassword === projectPassword;
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Project Password",
      });
    }

    const projectLog = new ProjectLog({
      project: project._id,
      user: user._id,
      startTime,
    });

    await projectLog.save();

    return res.status(200).json({
      success: true,
      message: "Time capturing started successfully",
      logId: projectLog._id,
    });
  } catch (error) {
    console.error("Error starting the project:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while starting the project",
    });
  }
};

const endProject = async (req, res) => {
  try {
    const { logId, endTime } = req.body;

    if (!endTime) {
      return res.status(400).json({
        success: false,
        message: "End time is required",
      });
    }

    const projectLog = await ProjectLog.findById(logId);
    if (!projectLog) {
      return res.status(404).json({
        success: false,
        message: "Project log not found",
      });
    }

    const totalMilliseconds = Math.abs(
      new Date(endTime).getTime() - new Date(projectLog.startTime).getTime()
    );
    const totalHours = totalMilliseconds / (1000 * 60 * 60);

    projectLog.endTime = new Date(endTime);
    projectLog.totalTime = totalHours;

    await projectLog.save();

    return res.status(200).json({
      success: true,
      message: "Time capturing ended successfully",
      totalTime: totalHours,
    });
  } catch (error) {
    console.error("Error ending the project:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while ending the project",
    });
  }
};

export { startProject, endProject };
