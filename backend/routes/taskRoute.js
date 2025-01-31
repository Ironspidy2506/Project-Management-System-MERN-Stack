import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  addTask,
  completeTask,
  deleteTask,
  editTask,
  getAllTasks,
  getDateWiseTaskUser,
  getMonthWiseTaskUser,
} from "../controllers/taskController.js";
import {
  getDateWiseTaskUserManager,
  getEmployeeWiseTasksManager,
  getManagerAssignedTasks,
  getMonthWiseTaskUserManager,
} from "../controllers/managerController.js";
import authAdmin from "../middlewares/authAdmin.js";

const taskRouter = express.Router();

taskRouter.get("/get-tasks", authAdmin, getAllTasks);

taskRouter.post("/add-task", authUser, addTask);

taskRouter.post("/add-task-admin", authAdmin, addTask);

taskRouter.post("/edit-task/:_id", authUser, editTask);

taskRouter.post("/edit-task-admin/:_id", authAdmin, editTask);

taskRouter.delete("/delete-task/:_id", authUser, deleteTask);

taskRouter.delete("/delete-task-admin/:_id", authAdmin, deleteTask);

taskRouter.post("/complete-task/:_id", authUser, completeTask);

taskRouter.post("/complete-task-admin/:_id", authAdmin, completeTask);

taskRouter.get("/get-date-wise/:date", authUser, getDateWiseTaskUser);

taskRouter.get("/get-month-wise/:date", authUser, getMonthWiseTaskUser);

taskRouter.get(
  "/get-date-wise-for-manager/:date",
  authUser,
  getDateWiseTaskUserManager
);

taskRouter.get(
  "/get-month-wise-for-manager/:month/:year",
  authUser,
  getMonthWiseTaskUserManager
);

taskRouter.get(
  "/get-employee-wise/:employeeId",
  authUser,
  getEmployeeWiseTasksManager
);

taskRouter.get(
  "/get-tasks-assigned-by-manager",
  authUser,
  getManagerAssignedTasks
);

export default taskRouter;
