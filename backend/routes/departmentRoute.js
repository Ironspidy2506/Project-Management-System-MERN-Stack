import express from "express";
import authAdmin from "../middlewares/authAdmin.js";
import {
  addDepartment,
  deleteDepartment,
  editDepartment,
  getDepartments,
} from "../controllers/departmentController.js";
import authUser from "../middlewares/authUser.js";

const departmentRouter = express.Router();

departmentRouter.get("/get-departments", authAdmin, getDepartments);

departmentRouter.get("/get-departments-manager", authUser, getDepartments);

departmentRouter.post("/add-department", authAdmin, addDepartment);

departmentRouter.post("/edit-department/:_id", authAdmin, editDepartment);

departmentRouter.delete("/delete-department/:_id", authAdmin, deleteDepartment);


export default departmentRouter;
