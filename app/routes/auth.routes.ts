import express, { Router } from "express";
import { onboardUserController, scoutController } from "../controllers/user";

const authRoute: Router = express.Router();

authRoute.post("/onboard", onboardUserController);
authRoute.post("/scout", scoutController);
export { authRoute };
