import express from "express";
import { 
    createTemporalData, 
    getTemporalAnalysis, 
    getTemporalTrends, 
    getEnvironmentalConditions, 
    getVegetationMoistureData 
} from "../controllers/temporalAnalysis.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyJWT);

// Temporal Analysis routes
router.route("/create-temporal-data").post(createTemporalData);
router.route("/field/:fieldId").get(getTemporalAnalysis);
router.route("/field/:fieldId/trends").get(getTemporalTrends);
router.route("/field/:fieldId/environmental").get(getEnvironmentalConditions);
router.route("/field/:fieldId/vegetation-moisture").get(getVegetationMoistureData);

export default router;
