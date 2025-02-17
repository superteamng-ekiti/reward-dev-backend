import express from "express";
import { createNewBadgeController } from "../controllers/badges";
import { isAdmin } from "../middleware/isAdmin";

const badgeRoute = express.Router();

badgeRoute.post("/create-badge", isAdmin, createNewBadgeController);

export { badgeRoute };
