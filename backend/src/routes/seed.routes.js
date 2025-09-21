import express from "express";
import { seedDatabase, getExampleData } from "../controllers/seed.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyJWT);

// Seed routes
router.route("/seed-db").post(seedDatabase);
router.route("/examples").get(getExampleData);

export default router;
