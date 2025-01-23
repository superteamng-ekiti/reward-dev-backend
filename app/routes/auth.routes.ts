import express, { Router } from "express";
import { onboardUserController } from "../controllers/user";

const authRoute: Router = express.Router();

authRoute.post("/onboard", onboardUserController);

export { authRoute };
