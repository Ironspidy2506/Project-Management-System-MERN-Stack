import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  addTask,
  completeTask,
  deleteTask,
  editTask,
  getDateWiseTaskUser,
  getMonthWiseTaskUser,
} from "../controllers/taskController.js";

const taskRouter = express.Router();

taskRouter.post("/add-task", authUser, addTask);

taskRouter.post("/edit-task/:_id", authUser, editTask);

taskRouter.delete("/delete-task/:_id", authUser, deleteTask);

taskRouter.post("/complete-task/:_id", authUser, completeTask);

taskRouter.get("/get-date-wise/:date", authUser, getDateWiseTaskUser);

taskRouter.get("/get-month-wise/:month/:year", authUser, getMonthWiseTaskUser);

export default taskRouter;
