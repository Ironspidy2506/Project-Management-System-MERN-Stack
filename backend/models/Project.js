import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    projectPassword: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxlength: 255,
    },
    remark: {
      type: String,
    },
    estimatedCost: {
      type: Number,
    },
    currentCost: {
      type: Number,
      default: 0,
    },
    estimatedHours: {
      type: Number,
    },
    currentHours: {
      type: Number,
      default: 0,
    },
    assignedManager: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    assignedTeamLeads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    assignedResources: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    status: {
      type: String,
      default: "Yet to Start",
    },
  },
  {
    timestamps: true,
  }
);

const projectModel = mongoose.model("Project", projectSchema);
export default projectModel;
