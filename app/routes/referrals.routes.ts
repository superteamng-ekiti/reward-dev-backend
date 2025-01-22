import express, { Router } from "express";

const referralRoute: Router = express.Router();

referralRoute.post("/fetch-referrals");

export { referralRoute };
