import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  addPerformance,
  deletePerformance,
  editPerformance,
  getDateWisePerformanceUser,
  getMonthWisePerformanceUser,
} from "../controllers/performanceController.js";

const performanceRouter = express.Router();

performanceRouter.post("/add-performance", authUser, addPerformance);

performanceRouter.post("/edit-performance/:_id", authUser, editPerformance);

performanceRouter.delete("/delete-performance/:_id", authUser, deletePerformance);

// performanceRouter.post("/complete-task/:_id", authUser, completeTask);

performanceRouter.get("/get-date-wise/:date", authUser, getDateWisePerformanceUser);

performanceRouter.get("/get-month-wise/:month/:year", authUser, getMonthWisePerformanceUser);

export default performanceRouter;
