import express from "express";
import {
  createNewBadgeController,
  fetchBadgesController
} from "../controllers/badges";
import { isAdmin } from "../middleware/isAdmin";

const badgeRoute = express.Router();

badgeRoute.post("/admin/create-badge", isAdmin, createNewBadgeController);
badgeRoute.get("/get-badges", fetchBadgesController);

export { badgeRoute };
