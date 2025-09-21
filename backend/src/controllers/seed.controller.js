import { Field } from "../models/field.model.js";
import { SpectralHealth } from "../models/spectralHealth.model.js";
import { SoilHealth } from "../models/soilHealth.model.js";
import { TemporalAnalysis } from "../models/temporalAnalysis.model.js";
import { Alert } from "../models/alert.model.js";
import { RiskPrediction } from "../models/riskPrediction.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { 
    exampleFields, 
    exampleSpectralHealthData, 
    exampleSoilHealthData, 
    exampleTemporalData, 
    exampleAlerts, 
    exampleRiskPredictions 
} from "../utils/seedData.js";

const seedDatabase = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    try {
        // Clear existing data
        await Field.deleteMany({ owner: userId });
        await SpectralHealth.deleteMany({});
        await SoilHealth.deleteMany({ owner: userId });
        await TemporalAnalysis.deleteMany({});
        await Alert.deleteMany({ owner: userId });
        await RiskPrediction.deleteMany({ owner: userId });

        // Create fields
        const createdFields = [];
        for (const fieldData of exampleFields) {
            const field = await Field.create({
                ...fieldData,
                owner: userId
            });
            createdFields.push(field);
        }

        // Create spectral health data
        const spectralHealthData = [];
        for (const field of createdFields) {
            for (const spectralData of exampleSpectralHealthData) {
                const healthData = await SpectralHealth.create({
                    fieldId: field._id,
                    zoneId: spectralData.zoneId,
                    ndviValue: spectralData.ndviValue,
                    healthPercentage: spectralData.healthPercentage,
                    healthStatus: spectralData.healthStatus,
                    coordinates: spectralData.coordinates,
                    sensorData: spectralData.sensorData,
                    measurementDate: new Date()
                });
                spectralHealthData.push(healthData);
            }
        }

        // Create soil health data
        const soilHealthData = [];
        for (const field of createdFields) {
            for (const soilData of exampleSoilHealthData) {
                const soilHealth = await SoilHealth.create({
                    fieldId: field._id,
                    zoneId: soilData.zoneId,
                    phLevel: soilData.phLevel,
                    moisture: soilData.moisture,
                    nitrogen: soilData.nitrogen,
                    phosphorus: soilData.phosphorus,
                    potassium: soilData.potassium,
                    organicMatter: soilData.organicMatter,
                    soilTemperature: soilData.soilTemperature,
                    soilType: soilData.soilType,
                    healthStatus: soilData.healthStatus,
                    healthScore: soilData.healthScore,
                    owner: userId
                });
                soilHealthData.push(soilHealth);
            }
        }

        // Create temporal analysis data
        const temporalData = [];
        for (const field of createdFields) {
            for (const tempData of exampleTemporalData) {
                const temporal = await TemporalAnalysis.create({
                    fieldId: field._id,
                    period: tempData.period,
                    vegetationHealth: tempData.vegetationHealth,
                    moisture: tempData.moisture,
                    environmentalConditions: tempData.environmentalConditions,
                    trendData: tempData.trendData,
                    measurementDate: new Date()
                });
                temporalData.push(temporal);
            }
        }

        // Create alerts
        const alerts = [];
        for (const field of createdFields) {
            for (const alertData of exampleAlerts) {
                const alert = await Alert.create({
                    fieldId: field._id,
                    zoneId: alertData.zoneId,
                    alertType: alertData.alertType,
                    severity: alertData.severity,
                    title: alertData.title,
                    description: alertData.description,
                    aiConfidence: alertData.aiConfidence,
                    metadata: alertData.metadata,
                    owner: userId
                });
                alerts.push(alert);
            }
        }

        // Create risk predictions
        const riskPredictions = [];
        for (const field of createdFields) {
            for (const riskData of exampleRiskPredictions) {
                const riskPrediction = await RiskPrediction.create({
                    fieldId: field._id,
                    zoneId: riskData.zoneId,
                    riskLevel: riskData.riskLevel,
                    riskType: riskData.riskType,
                    probability: riskData.probability,
                    aiConfidence: riskData.aiConfidence,
                    coordinates: riskData.coordinates,
                    timeHorizon: riskData.timeHorizon,
                    factors: riskData.factors,
                    recommendations: riskData.recommendations,
                    owner: userId
                });
                riskPredictions.push(riskPrediction);
            }
        }

        return res
            .status(201)
            .json(new ApiResponse(201, {
                fields: createdFields.length,
                spectralHealth: spectralHealthData.length,
                soilHealth: soilHealthData.length,
                temporalAnalysis: temporalData.length,
                alerts: alerts.length,
                riskPredictions: riskPredictions.length,
                message: "Database seeded successfully with example agricultural data"
            }, "Database seeded successfully"));

    } catch (error) {
        console.error("Seeding error:", error);
        throw new Error("Failed to seed database");
    }
});

const getExampleData = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, {
            fields: exampleFields,
            spectralHealth: exampleSpectralHealthData,
            soilHealth: exampleSoilHealthData,
            temporalData: exampleTemporalData,
            alerts: exampleAlerts,
            riskPredictions: exampleRiskPredictions
        }, "Example data retrieved successfully"));
});

export { seedDatabase, getExampleData };
