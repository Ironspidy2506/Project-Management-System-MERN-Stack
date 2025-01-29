import mongoose from "mongoose";

const costSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    costId: {
      type: String,
      required: true,
      unique: true,
    },
    costName: {
      type: String,
      required: true,
    },
    costAmount: {
      type: Number,
      required: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const costModel = mongoose.model("Costs", costSchema);
export default costModel;
