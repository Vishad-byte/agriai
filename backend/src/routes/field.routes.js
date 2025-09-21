import express from "express";
import { 
    createField, 
    getFields, 
    getFieldById, 
    updateField, 
    deleteField, 
    getFieldSummary 
} from "../controllers/field.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyJWT);

// Field routes
router.route("/create-field").post(createField);
router.route("/get-fields").get(getFields);
router.route("/summary").get(getFieldSummary);
router.route("/get-field-by-id/:fieldId").get(getFieldById);
router.route("/update-field/:fieldId").put(updateField);
router.route("/delete-field/:fieldId").delete(deleteField);

export default router;
