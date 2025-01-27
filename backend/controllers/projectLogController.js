import bcrypt from "bcrypt";
import ProjectLog from "../models/ProjectLog.js";
import User from "../models/Users.js";
import Project from "../models/Project.js";

const startProject = async (req, res) => {
  try {
    const { userId, projectId, projectPassword } = req.body;

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
      startTime: Date.now(),
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
    const { logId } = req.body;

    const projectLog = await ProjectLog.findById(logId);
    if (!projectLog) {
      return res
        .status(404)
        .json({ success: false, message: "Project log not found" });
    }

    const endTime = Date.now();
    const totalMilliseconds =
      endTime - new Date(projectLog.startTime).getTime();
    const totalMinutes = totalMilliseconds / (1000 * 60);

    const baseHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    let fractionalHours = 0;
    if (remainingMinutes > 0 && remainingMinutes <= 15) {
      fractionalHours = 0.25;
    } else if (remainingMinutes > 15 && remainingMinutes <= 30) {
      fractionalHours = 0.5;
    } else if (remainingMinutes > 30 && remainingMinutes <= 45) {
      fractionalHours = 0.75;
    } else if (remainingMinutes > 45) {
      fractionalHours = 1;
    }

    const totalTime = baseHours + fractionalHours;

    projectLog.endTime = endTime;
    projectLog.totalTime = totalTime;

    await projectLog.save();

    return res.status(200).json({
      success: true,
      message: "Time capturing ended successfully",
      totalTime,
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
