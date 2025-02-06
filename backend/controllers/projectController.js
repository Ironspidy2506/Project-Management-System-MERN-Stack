import Project from "../models/Project.js";

// Add a New Project
const addProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.json({ success: true, message: "Project added successfully" });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

// Edit an Existing Project
const editProject = async (req, res) => {
  const { _id } = req.params;
  try {
    const updatedProject = await Project.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    if (!updatedProject) {
      return res.json({ success: false, error: "Project not found" });
    }
    res.json({
      success: true,
      message: "Project details updated successfully",
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

// Delete a Project
const deleteProject = async (req, res) => {
  const { _id } = req.params;
  try {
    const deletedProject = await Project.findByIdAndDelete(_id);
    if (!deletedProject) {
      return res.json({ success: false, error: "Project not found" });
    }
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

// Get All Projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const viewProjectDetails = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("assignedManager", "name employeeId")
      .populate("assignedTeamLeads", "name employeeId")
      .populate("assignedResources", "name employeeId");

    res.status(200).json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export {
  addProject,
  editProject,
  deleteProject,
  getProjects,
  viewProjectDetails,
};
