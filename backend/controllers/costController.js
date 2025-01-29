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

    // Update project currentCost
    const totalCost = await Cost.aggregate([
      { $match: { project: project._id } },
      { $group: { _id: null, total: { $sum: "$costAmount" } } },
    ]);
    const newCurrentCost = totalCost.length > 0 ? totalCost[0].total : 0;
    await Project.findByIdAndUpdate(
      project._id,
      { currentCost: newCurrentCost },
      { new: true }
    );

    return res.json({ success: true, message: "Cost added successfully" });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.json({ success: false, message: error.message });
  }
};

const editCost = async (req, res) => {
  try {
    const { costId } = req.params;
    const { costName, costAmount } = req.body;

    const cost = await Cost.findById(costId);
    if (!cost) return res.json({ success: false, message: "Cost not found" });

    await Cost.findByIdAndUpdate(
      costId,
      { costName, costAmount },
      { new: true }
    );

    // Update project currentCost
    const totalCost = await Cost.aggregate([
      { $match: { project: cost.project } },
      { $group: { _id: null, total: { $sum: "$costAmount" } } },
    ]);
    const newCurrentCost = totalCost.length > 0 ? totalCost[0].total : 0;
    await Project.findByIdAndUpdate(
      cost.project,
      { currentCost: newCurrentCost },
      { new: true }
    );

    return res.json({ success: true, message: "Cost updated successfully" });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.json({ success: false, message: error.message });
  }
};

const deleteCost = async (req, res) => {
  try {
    const { costId } = req.params;
    const cost = await Cost.findById(costId);
    if (!cost) return res.json({ success: false, message: "Cost not found" });

    await Cost.findByIdAndDelete(costId);

    const totalCost = await Cost.aggregate([
      { $match: { project: cost.project } },
      { $group: { _id: null, total: { $sum: "$costAmount" } } },
    ]);

    const newCurrentCost = totalCost.length > 0 ? totalCost[0].total : 0;
    await Project.findByIdAndUpdate(cost.project, {
      currentCost: newCurrentCost,
    });

    return res.json({ success: true, message: "Cost deleted successfully" });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.json({ success: false, message: error.message });
  }
};

const getCostsAddedByManager = async (req, res) => {
  try {
    const { userId } = req.body;
    const costs = await Cost.find({ addedBy: userId }).populate("project");

    return res.json({ success: true, costs });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.json({ success: false, message: error.message });
  }
};

export { addCost, editCost, deleteCost, getCostsAddedByManager };
