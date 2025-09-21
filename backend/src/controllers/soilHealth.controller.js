import { SoilHealth } from "../models/soilHealth.model.js";
import { Field } from "../models/field.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createSoilHealthData = asyncHandler(async (req, res) => {
    const { 
        fieldId, 
        zoneId, 
        phLevel, 
        moisture, 
        nitrogen, 
        phosphorus, 
        potassium,
        organicMatter,
        soilTemperature,
        soilType 
    } = req.body;

    if (!fieldId || !zoneId || !phLevel || !moisture || !nitrogen || !phosphorus || !potassium) {
        throw new ApiError(400, "Required fields: fieldId, zoneId, phLevel, moisture, nitrogen, phosphorus, potassium");
    }

    // Verify field ownership
    const field = await Field.findOne({ _id: fieldId, owner: req.user._id });
    if (!field) {
        throw new ApiError(404, "Field not found or access denied");
    }

    // Calculate health score and status
    const healthScore = calculateSoilHealthScore(phLevel, moisture, nitrogen, phosphorus, potassium);
    const healthStatus = determineSoilHealthStatus(healthScore);

    const soilHealthData = await SoilHealth.create({
        fieldId,
        zoneId,
        phLevel,
        moisture,
        nitrogen,
        phosphorus,
        potassium,
        organicMatter,
        soilTemperature,
        soilType,
        healthScore,
        healthStatus,
        owner: req.user._id
    });

    return res
        .status(201)
        .json(new ApiResponse(201, soilHealthData, "Soil health data created successfully"));
});

const getSoilHealthOverview = asyncHandler(async (req, res) => {
    const { fieldId } = req.params;
    const { limit = 10 } = req.query;

    // Verify field ownership
    const field = await Field.findOne({ _id: fieldId, owner: req.user._id });
    if (!field) {
        throw new ApiError(404, "Field not found or access denied");
    }

    const soilHealthData = await SoilHealth.find({ fieldId })
        .sort({ measurementDate: -1 })
        .limit(parseInt(limit));

    // Group by zone for overview display
    const zoneOverview = {};
    soilHealthData.forEach(data => {
        if (!zoneOverview[data.zoneId]) {
            zoneOverview[data.zoneId] = {
                zoneId: data.zoneId,
                phLevel: data.phLevel,
                moisture: data.moisture,
                nitrogen: data.nitrogen,
                phosphorus: data.phosphorus,
                potassium: data.potassium,
                healthStatus: data.healthStatus,
                healthScore: data.healthScore,
                measurementDate: data.measurementDate
            };
        }
    });

    return res
        .status(200)
        .json(new ApiResponse(200, {
            fieldId,
            fieldName: field.name,
            soilOverview: Object.values(zoneOverview),
            totalZones: Object.keys(zoneOverview).length
        }, "Soil health overview retrieved successfully"));
});

const getSoilHealthByZone = asyncHandler(async (req, res) => {
    const { fieldId, zoneId } = req.params;
    const { limit = 5 } = req.query;

    // Verify field ownership
    const field = await Field.findOne({ _id: fieldId, owner: req.user._id });
    if (!field) {
        throw new ApiError(404, "Field not found or access denied");
    }

    const soilHealthData = await SoilHealth.find({ 
        fieldId, 
        zoneId 
    })
    .sort({ measurementDate: -1 })
    .limit(parseInt(limit));

    if (soilHealthData.length === 0) {
        throw new ApiError(404, "No soil health data found for this zone");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {
            fieldId,
            zoneId,
            data: soilHealthData
        }, "Soil health data for zone retrieved successfully"));
});

const getSoilHealthSummary = asyncHandler(async (req, res) => {
    const { fieldId } = req.params;

    // Verify field ownership
    const field = await Field.findOne({ _id: fieldId, owner: req.user._id });
    if (!field) {
        throw new ApiError(404, "Field not found or access denied");
    }

    const summary = await SoilHealth.aggregate([
        { $match: { fieldId: field._id } },
        {
            $group: {
                _id: null,
                totalZones: { $addToSet: "$zoneId" },
                avgPhLevel: { $avg: "$phLevel" },
                avgMoisture: { $avg: "$moisture" },
                avgNitrogen: { $avg: "$nitrogen" },
                avgPhosphorus: { $avg: "$phosphorus" },
                avgPotassium: { $avg: "$potassium" },
                avgHealthScore: { $avg: "$healthScore" },
                healthStatusCount: {
                    $push: "$healthStatus"
                }
            }
        }
    ]);

    const healthStatusCounts = {};
    if (summary.length > 0) {
        summary[0].healthStatusCount.forEach(status => {
            healthStatusCounts[status] = (healthStatusCounts[status] || 0) + 1;
        });
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {
            fieldId,
            fieldName: field.name,
            totalZones: summary[0]?.totalZones?.length || 0,
            averagePhLevel: Math.round((summary[0]?.avgPhLevel || 0) * 100) / 100,
            averageMoisture: Math.round((summary[0]?.avgMoisture || 0) * 100) / 100,
            averageNitrogen: Math.round((summary[0]?.avgNitrogen || 0) * 100) / 100,
            averagePhosphorus: Math.round((summary[0]?.avgPhosphorus || 0) * 100) / 100,
            averagePotassium: Math.round((summary[0]?.avgPotassium || 0) * 100) / 100,
            averageHealthScore: Math.round((summary[0]?.avgHealthScore || 0) * 100) / 100,
            healthStatusDistribution: healthStatusCounts
        }, "Soil health summary retrieved successfully"));
});

const getSoilHealthTrends = asyncHandler(async (req, res) => {
    const { fieldId } = req.params;
    const { zoneId, days = 30 } = req.query;

    // Verify field ownership
    const field = await Field.findOne({ _id: fieldId, owner: req.user._id });
    if (!field) {
        throw new ApiError(404, "Field not found or access denied");
    }

    const filter = { fieldId };
    if (zoneId) filter.zoneId = zoneId;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const soilHealthData = await SoilHealth.find({
        ...filter,
        measurementDate: { $gte: startDate }
    })
    .sort({ measurementDate: 1 });

    // Calculate trends
    const trends = calculateSoilTrends(soilHealthData);

    return res
        .status(200)
        .json(new ApiResponse(200, {
            fieldId,
            zoneId: zoneId || 'all',
            period: `${days} days`,
            data: soilHealthData,
            trends
        }, "Soil health trends retrieved successfully"));
});

// Helper function to calculate soil health score
function calculateSoilHealthScore(phLevel, moisture, nitrogen, phosphorus, potassium) {
    // Weighted scoring system
    const phScore = Math.max(0, 100 - Math.abs(phLevel - 6.5) * 10); // Optimal pH around 6.5
    const moistureScore = moisture; // Direct percentage
    const nutrientScore = (nitrogen + phosphorus + potassium) / 3; // Average of nutrients
    
    return Math.round((phScore * 0.3 + moistureScore * 0.4 + nutrientScore * 0.3));
}

// Helper function to determine soil health status
function determineSoilHealthStatus(healthScore) {
    if (healthScore >= 80) return 'excellent';
    if (healthScore >= 60) return 'good';
    if (healthScore >= 40) return 'fair';
    return 'poor';
}

// Helper function to calculate soil trends
function calculateSoilTrends(data) {
    if (data.length < 2) {
        return {
            phLevel: { trend: 'stable', change: 0 },
            moisture: { trend: 'stable', change: 0 },
            nutrients: { trend: 'stable', change: 0 },
            healthScore: { trend: 'stable', change: 0 }
        };
    }

    const first = data[0];
    const last = data[data.length - 1];

    const phChange = last.phLevel - first.phLevel;
    const moistureChange = last.moisture - first.moisture;
    const nutrientChange = ((last.nitrogen + last.phosphorus + last.potassium) / 3) - 
                          ((first.nitrogen + first.phosphorus + first.potassium) / 3);
    const healthChange = last.healthScore - first.healthScore;

    return {
        phLevel: {
            trend: phChange > 0.1 ? 'increasing' : phChange < -0.1 ? 'decreasing' : 'stable',
            change: Math.round(phChange * 100) / 100
        },
        moisture: {
            trend: moistureChange > 5 ? 'increasing' : moistureChange < -5 ? 'decreasing' : 'stable',
            change: Math.round(moistureChange * 100) / 100
        },
        nutrients: {
            trend: nutrientChange > 5 ? 'increasing' : nutrientChange < -5 ? 'decreasing' : 'stable',
            change: Math.round(nutrientChange * 100) / 100
        },
        healthScore: {
            trend: healthChange > 5 ? 'increasing' : healthChange < -5 ? 'decreasing' : 'stable',
            change: Math.round(healthChange * 100) / 100
        }
    };
}

export {
    createSoilHealthData,
    getSoilHealthOverview,
    getSoilHealthByZone,
    getSoilHealthSummary,
    getSoilHealthTrends
};
