import mongoose from "mongoose";

const projectLogSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    totalTime: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const projectLogModel = mongoose.model("ProjectLog", projectLogSchema);
export default projectLogModel;
