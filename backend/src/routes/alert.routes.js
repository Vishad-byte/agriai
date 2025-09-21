import express from "express";
import { 
    createAlert, 
    getActiveAlerts, 
    getAlertsByField, 
    updateAlertStatus, 
    getAlertSummary, 
    getRecentAlerts 
} from "../controllers/alert.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyJWT);

// Alert routes
router.route("/").post(createAlert);
router.route("/active").get(getActiveAlerts);
router.route("/summary").get(getAlertSummary);
router.route("/recent").get(getRecentAlerts);
router.route("/field/:fieldId").get(getAlertsByField);
router.route("/:alertId/status").put(updateAlertStatus);

export default router;
