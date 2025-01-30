import express from "express";
import authAdmin from "../middlewares/authAdmin.js";
import editUser, {
  addUser,
  deleteUser,
  getUsers,
  loginUser,
  getUserProjects,
  getUserProfile,
  getUserTasks,
  getUserPerformances,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import { getAllEmployeesPerformancesForManager } from "../controllers/managerController.js";
import { getUserProjectLogs } from "../controllers/projectLogController.js";

const userRouter = express.Router();

userRouter.post("/login", loginUser);

userRouter.get("/get-my-projects", authUser, getUserProjects);

userRouter.get("/get-my-tasks", authUser, getUserTasks);

userRouter.get("/get-my-performances", authUser, getUserPerformances);

userRouter.get("/get-my-profile", authUser, getUserProfile);

userRouter.get("/get-my-project-logs", authUser, getUserProjectLogs);

userRouter.get("/get-users", authAdmin, getUsers);

userRouter.get("/get-users-manager", authUser, getUsers);

userRouter.get("/get-users-for-performance", authUser, getUsers);

userRouter.post("/add-user", authAdmin, addUser);

userRouter.post("/add-user-manager", authUser, addUser);

userRouter.post("/edit-user/:_id", authAdmin, editUser);

userRouter.post("/edit-user-manager/:_id", authUser, editUser);

userRouter.delete("/delete-user/:_id", authAdmin, deleteUser);

userRouter.delete("/delete-user-manager/:_id", authUser, deleteUser);

userRouter.get(
  "/get-employees-performances-for-manager",
  authUser,
  getAllEmployeesPerformancesForManager
);

export default userRouter;
