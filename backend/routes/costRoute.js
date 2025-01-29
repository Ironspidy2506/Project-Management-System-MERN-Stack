import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  addCost,
  deleteCost,
  editCost,
  getCostsAddedByManager,
} from "../controllers/costController.js";

const costRouter = express.Router();

costRouter.post("/add-cost-manager", authUser, addCost);

costRouter.post("/edit-cost-manager/:costId", authUser, editCost);

costRouter.delete("/delete-cost-manager/:costId", authUser, deleteCost);

costRouter.get("/get-cost-added-by-manager", authUser, getCostsAddedByManager);

export default costRouter;
