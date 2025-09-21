import express from "express";
import { 
    createRiskPrediction, 
    getRiskPredictions, 
    getRiskZoneMap, 
    getRiskSummary, 
    getHighRiskZones, 
    getRiskRecommendations 
} from "../controllers/riskPrediction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyJWT);

// Risk Prediction routes
router.route("/").post(createRiskPrediction);
router.route("/field/:fieldId").get(getRiskPredictions);
router.route("/field/:fieldId/map").get(getRiskZoneMap);
router.route("/field/:fieldId/summary").get(getRiskSummary);
router.route("/field/:fieldId/high-risk").get(getHighRiskZones);
router.route("/field/:fieldId/recommendations").get(getRiskRecommendations);

export default router;
