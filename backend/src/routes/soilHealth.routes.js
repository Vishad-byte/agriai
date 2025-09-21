import express from "express";
import { 
    createSoilHealthData, 
    getSoilHealthOverview, 
    getSoilHealthByZone, 
    getSoilHealthSummary, 
    getSoilHealthTrends 
} from "../controllers/soilHealth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyJWT);

// Soil Health routes
router.route("/").post(createSoilHealthData);
router.route("/field/:fieldId/overview").get(getSoilHealthOverview);
router.route("/field/:fieldId/zone/:zoneId").get(getSoilHealthByZone);
router.route("/field/:fieldId/summary").get(getSoilHealthSummary);
router.route("/field/:fieldId/trends").get(getSoilHealthTrends);

export default router;
