import Cost from "../models/Costs.js";
import Project from "../models/Project.js";
import User from "../models/Users.js";

const addCost = async (req, res) => {
  try {
    const { projectId, userId, costId, costName, costAmount } = req.body;

    const user = await User.findById(userId);

    const project = await Project.findById(projectId);

    const newCost = new Cost({
      project: project._id,
      costId,
      costName,
      costAmount,
      addedBy: user._id,
    });

    await newCost.save();

    return res.json({ success: true, message: "Cost Added Successfully" });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const editCost = async (req, res) => {
  try {
    const { costId } = req.params;
    const { costName, costAmount } = req.body;

    await Cost.findByIdAndUpdate(
      costId,
      { costName, costAmount },
      { new: true }
    );

    return res.json({ success: true, message: "Cost Added Successfully" });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCost = async (req, res) => {
  try {
    const { costId } = req.params;
    await Cost.findByIdAndDelete(costId);

    return res.json({ success: true, message: "Cost deleted successfully" });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const getCostsAddedByManager = async (req, res) => {
  try {
    const { userId } = req.body;
    const costs = await Cost.find({ addedBy: userId });

    return res.json({
      success: true,
      costs,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export { addCost, editCost, deleteCost, getCostsAddedByManager };
