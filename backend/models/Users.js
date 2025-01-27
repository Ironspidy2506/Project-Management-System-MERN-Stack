import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    default: 0,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
  branch: {
    type: String,
  },
  role: {
    type: String,
    enum: ["Admin", "Manager", "User"],
    default: "User",
  },
  assignedProjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
  assignedTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

const userModel = mongoose.model("User", userSchema);
export default userModel;
