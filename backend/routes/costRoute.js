import express from "express";
import authUser from "../middlewares/authUser";
import {
  addCost,
  deleteCost,
  editCost,
  getCostsAddedByManager,
} from "../controllers/costController";

const costRouter = express.Router();

costRouter.post("/add-cost-manager", authUser, addCost);

costRouter.post("/edit-cost-manager/:costId", authUser, editCost);

costRouter.post("/delete-cost-manager/:costId", authUser, deleteCost);

costRouter.post("/get-cost-added-by-manager", authUser, getCostsAddedByManager);

export default costRouter;
