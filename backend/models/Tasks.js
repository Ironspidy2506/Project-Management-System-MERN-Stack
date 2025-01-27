import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    taskId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    task: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    added: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const taskModel = mongoose.model("Tasks", taskSchema);
export default taskModel;
