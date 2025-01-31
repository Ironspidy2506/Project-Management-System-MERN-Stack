import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  addPerformance,
  deletePerformance,
  editPerformance,
  getAllPerformances,
  getDateWisePerformanceUser,
  getMonthWisePerformanceUser,
} from "../controllers/performanceController.js";
import {
  changeStatusOfPerformance,
  getDateWisePerformanceUserManager,
  getEmployeeWisePerformancesManager,
  getMonthWisePerformanceUserManager,
} from "../controllers/managerController.js";
import authAdmin from "../middlewares/authAdmin.js";

const performanceRouter = express.Router();

performanceRouter.get("/get-performances", authAdmin, getAllPerformances);

performanceRouter.post(
  "/change-status/:performanceId",
  authAdmin,
  changeStatusOfPerformance
);

performanceRouter.post(
  "/change-status-manager/:performanceId",
  authUser,
  changeStatusOfPerformance
);

performanceRouter.post("/add-performance", authUser, addPerformance);

performanceRouter.post("/edit-performance/:_id", authUser, editPerformance);

performanceRouter.delete(
  "/delete-performance/:_id",
  authUser,
  deletePerformance
);

// performanceRouter.post("/complete-task/:_id", authUser, completeTask);

performanceRouter.get(
  "/get-date-wise/:date",
  authUser,
  getDateWisePerformanceUser
);

performanceRouter.get(
  "/get-month-wise/:month/:year",
  authUser,
  getMonthWisePerformanceUser
);

performanceRouter.get(
  "/get-date-wise-for-manager/:date",
  authUser,
  getDateWisePerformanceUserManager
);

performanceRouter.get(
  "/get-month-wise-for-manager/:month/:year",
  authUser,
  getMonthWisePerformanceUserManager
);

performanceRouter.get(
  "/get-employee-wise/:employeeId",
  authUser,
  getEmployeeWisePerformancesManager
);

export default performanceRouter;
