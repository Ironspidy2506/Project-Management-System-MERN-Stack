import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  endProject,
  startProject,
} from "../controllers/projectLogController.js";

const projectLogRouter = express.Router();

projectLogRouter.post("/start-project", authUser, startProject);

projectLogRouter.post("/end-project", authUser, endProject);

export default projectLogRouter;