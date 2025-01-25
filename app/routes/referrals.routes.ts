import express, { Router } from "express";
import { fetchReferrralsController } from "../controllers/referrals";

const referralRoute: Router = express.Router();

referralRoute.post("/fetch-referrals", fetchReferrralsController);

export { referralRoute };
