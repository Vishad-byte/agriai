import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Import routes
import userRoutes from "./routes/user.routes.js";
import fieldRoutes from "./routes/field.routes.js";
import spectralHealthRoutes from "./routes/spectralHealth.routes.js";
import temporalAnalysisRoutes from "./routes/temporalAnalysis.routes.js";
import alertRoutes from "./routes/alert.routes.js";
import soilHealthRoutes from "./routes/soilHealth.routes.js";
import riskPredictionRoutes from "./routes/riskPrediction.routes.js";
import seedRoutes from "./routes/seed.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/fields", fieldRoutes);
app.use("/api/v1/spectral-health", spectralHealthRoutes);
app.use("/api/v1/temporal-analysis", temporalAnalysisRoutes);
app.use("/api/v1/alerts", alertRoutes);
app.use("/api/v1/soil-health", soilHealthRoutes);
app.use("/api/v1/risk-predictions", riskPredictionRoutes);
app.use("/api/v1/seed", seedRoutes);

// Basic route
app.get("/", (req, res) => {
    res.json({ message: "AgriAI Backend API is running!" });
});

// Health check route
app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

export default app;
