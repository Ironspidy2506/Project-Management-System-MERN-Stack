import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  departmentId: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  departmentName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  isManagement: {
    type: Boolean,
    default: false,
  },
});

const departmentModel = mongoose.model("Department", departmentSchema);
export default departmentModel;
