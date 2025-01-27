import express from "express";
import authAdmin from "../middlewares/authAdmin.js";
import {
  getProjects,
  addProject,
  editProject,
  deleteProject,
} from "../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.get("/get-projects", authAdmin, getProjects);

projectRouter.post("/add-project", authAdmin, addProject);

projectRouter.post("/edit-project/:_id", authAdmin, editProject);

projectRouter.delete("/delete-project/:_id", authAdmin, deleteProject);

export default projectRouter;
