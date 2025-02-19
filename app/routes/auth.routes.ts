import express, { Router } from "express";
import {
  onboardUserController,
  scoutController,
  fetchUserController,
  leaderboardController,
} from "../controllers/user";

const authRoute: Router = express.Router();

authRoute.post("/onboard", onboardUserController);
authRoute.post("/scout", scoutController);
authRoute.get("/fetch-user", fetchUserController);
authRoute.get("/leaderboard", leaderboardController);

export { authRoute };
