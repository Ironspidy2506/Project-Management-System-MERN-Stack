import User from "../models/Users.js";
import Project from "../models/Project.js";
import Task from "../models/Tasks.js";
import Performance from "../models/Performance.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

// API for login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "No user found with the provided email.",
      });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Wrong password.",
      });
    }

    // Generate token based on role
    const payload = { id: user._id, role: user.role };
    const secretKey = process.env.JWT_SECRET_KEY;

    if (user.role === "Manager") {
      const mtoken = jwt.sign(payload, secretKey, { expiresIn: "24h" });
      return res.json({
        success: true,
        mtoken,
        message: "Manager Login Successful",
      });
    } else {
      const token = jwt.sign(payload, secretKey, { expiresIn: "24h" });
      return res.json({
        success: true,
        token,
        message: "Employee Login Successful",
      });
    }
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to get users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("department");
    return res.json({ success: true, users });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// API to add user
const addUser = async (req, res) => {
  try {
    const {
      employeeId,
      name,
      email,
      password,
      phone,
      department,
      branch,
      role,
    } = req.body;

    if (!employeeId || !name || !email || !password) {
      return res.json({ success: false, message: "Missing required details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email address" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      employeeId,
      name,
      email,
      password: hashedPassword,
      phone,
      department,
      branch,
      role,
    });

    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    return res.json({
      success: true,
      token,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};

// API to edit user
const editUser = async (req, res) => {
  try {
    const { _id } = req.params;
    const { employeeId, name, email, phone, department, branch, role } =
      req.body;

    const user = await User.findById({ _id });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (employeeId) user.employeeId = employeeId;
    if (name) user.name = name;
    if (email) {
      if (!validator.isEmail(email)) {
        return res.json({ success: false, message: "Invalid email address" });
      }
      user.email = email;
    }
    if (phone) user.phone = phone;
    if (department) user.department = department;
    if (branch) user.branch = branch;
    if (role) user.role = role;

    const updatedUser = await user.save();

    return res.json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};

export default editUser;

// API to delete user
const deleteUser = async (req, res) => {
  try {
    const { _id } = req.params;

    const user = await User.findByIdAndDelete({ _id });
    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    return res.json({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// API to get user projects
const getUserProjects = async (req, res) => {
  try {
    const { userId } = req.body;

    const projects = await Project.find({
      $or: [
        { assignedManager: userId },
        { assignedTeamLeads: userId },
        { assignedResources: userId },
      ],
    })
      .populate("assignedManager", "name employeeId")
      .populate("assignedTeamLeads", "name employeeId")
      .populate("assignedResources", "name employeeId");

    return res.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error.message);
    return res.json({
      success: false,
      error: "Failed to fetch projects. Please try again later.",
    });
  }
};

// API to get user tasks
const getUserTasks = async (req, res) => {
  try {
    const { userId } = req.body;

    const tasks = await Task.find({ user: userId })
      .populate("project")
      .populate("user");

    return res.json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("Error fetching projects:", error.message);
    return res.json({
      success: false,
      error: "Failed to fetch projects. Please try again later.",
    });
  }
};

// API to get user performances
const getUserPerformances = async (req, res) => {
  try {
    const { userId } = req.body;

    const performances = await Performance.find({ user: userId })
      .populate("drawingReleased")
      .populate("project")
      .populate("user");

    return res.json({
      success: true,
      performances,
    });
  } catch (error) {
    console.error("Error fetching projects:", error.message);
    return res.json({
      success: false,
      error: "Failed to fetch projects. Please try again later.",
    });
  }
};

// API to get user profile
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById({ _id: userId }).populate("department");

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    return res.json({
      success: false,
      error: "Failed to fetch profile. Please try again later.",
    });
  }
};

export {
  addUser,
  editUser,
  getUsers,
  deleteUser,
  loginUser,
  getUserProjects,
  getUserTasks,
  getUserPerformances,
  getUserProfile,
};
