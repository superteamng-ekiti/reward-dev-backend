import express, { Router } from "express"; // Import express

const router: Router = express.Router(); // Create a new router using express.Router()
import { getUserDetails } from "../controllers/user";

router.post("/user-details", getUserDetails);

export default router;
