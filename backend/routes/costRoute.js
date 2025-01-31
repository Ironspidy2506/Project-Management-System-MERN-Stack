import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  addCost,
  deleteCost,
  editCost,
  getAllCosts,
  getCostsAddedByManager,
} from "../controllers/costController.js";
import authAdmin from "../middlewares/authAdmin.js";

const costRouter = express.Router();

costRouter.get("/get-costs", authAdmin, getAllCosts);

costRouter.post("/add-cost", authAdmin, addCost);

costRouter.post("/add-cost-manager", authUser, addCost);

costRouter.post("/edit-cost/:costId", authAdmin, editCost);

costRouter.post("/edit-cost-manager/:costId", authUser, editCost);

costRouter.delete("/delete-cost/:costId", authAdmin, deleteCost);

costRouter.delete("/delete-cost-manager/:costId", authUser, deleteCost);

costRouter.get("/get-cost-added-by-manager", authUser, getCostsAddedByManager);

export default costRouter;
