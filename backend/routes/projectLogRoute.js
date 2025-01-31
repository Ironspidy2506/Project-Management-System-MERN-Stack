import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  addProjectLog,
  deleteProjectLog,
  editProjectLog,
  endProject,
  getAllLogs,
  getDateWiseProjectLogUser,
  getEmployeeProjectLogs,
  getMonthWiseProjectLogUser,
  startProject,
} from "../controllers/projectLogController.js";
import authAdmin from "../middlewares/authAdmin.js";

const projectLogRouter = express.Router();

projectLogRouter.get("/get-logs", authAdmin, getAllLogs)

projectLogRouter.post("/start-project", authUser, startProject);

projectLogRouter.post("/end-project", authUser, endProject);

projectLogRouter.post("/add-log", authUser, addProjectLog);

projectLogRouter.post("/edit-log/:logId", authUser, editProjectLog);

projectLogRouter.delete("/delete-log/:logId", authUser, deleteProjectLog);

projectLogRouter.get(
  "/get-date-wise/:date",
  authUser,
  getDateWiseProjectLogUser
);

projectLogRouter.get(
  "/get-month-wise/:month/:year",
  authUser,
  getMonthWiseProjectLogUser
);

projectLogRouter.get(
  "/get-employee-project-logs",
  authUser,
  getEmployeeProjectLogs
);

export default projectLogRouter;
