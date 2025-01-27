import mongoose from "mongoose";

const performanceSchema = new mongoose.Schema(
  {
    performanceId: {
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
    drawingType: {
      type: String,
      required: true,
    },
    drawingReleased: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    drawings: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
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

const performanceModel = mongoose.model("Performance", performanceSchema);
export default performanceModel;
