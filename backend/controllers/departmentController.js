import Department from "../models/Department.js";

// API to Add a new department
const addDepartment = async (req, res) => {
  try {
    const { departmentId, departmentName, description, isManagement } =
      req.body;

    const department = await Department.findOne({ departmentId });
    if (department) {
      return res.json({
        success: false,
        message: "Department with this ID already exists!",
      });
    }

    const newDepartment = new Department({
      departmentId,
      departmentName,
      description,
      isManagement,
    });

    await newDepartment.save();
    return res.json({
      success: true,
      message: "Department added successfully!",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// API to Edit an existing department
const editDepartment = async (req, res) => {
  try {
    const { _id } = req.params;
    const { departmentId, departmentName, description, isManagement } =
      req.body;

    const department = await Department.findById({ _id });
    if (!department) {
      return res.json({ success: false, message: "Department not found!" });
    }

    department.departmentId = departmentId || department.departmentId;
    department.departmentName = departmentName || department.departmentName;
    department.description = description || department.description;
    department.isManagement =
      isManagement !== undefined ? isManagement : department.isManagement;

    await department.save();
    return res.json({
      success: true,
      message: "Department updated successfully!",
      department,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// API to Delete a department
const deleteDepartment = async (req, res) => {
  try {
    const { _id } = req.params;

    const department = await Department.findByIdAndDelete({ _id });
    if (!department) {
      return res.json({ success: false, message: "Department not found!" });
    }

    return res.json({
      success: true,
      message: "Department deleted successfully!",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// API to get all departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    return res.json({ success: true, departments });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export { addDepartment, editDepartment, deleteDepartment, getDepartments };
