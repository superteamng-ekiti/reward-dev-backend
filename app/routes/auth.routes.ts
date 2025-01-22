import express, { Router } from "express";

const authRoute: Router = express.Router();

authRoute.post("/do-signup");

export { authRoute };
