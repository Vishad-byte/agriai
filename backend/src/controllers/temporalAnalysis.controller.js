import { TemporalAnalysis } from "../models/temporalAnalysis.model.js";
import { Field } from "../models/field.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTemporalData = asyncHandler(async (req, res) => {
    const { 
        fieldId, 
        period, 
        vegetationHealth, 
        moisture, 
        environmentalConditions 
    } = req.body;

    if (!fieldId || !period || !vegetationHealth || !moisture || !environmentalConditions) {
        throw new ApiError(400, "Required fields: fieldId, period, vegetationHealth, moisture, environmentalConditions");
    }

    // Verify field ownership
    const field = await Field.findOne({ _id: fieldId, owner: req.user._id });
    if (!field) {
        throw new ApiError(404, "Field not found or access denied");
    }

    const temporalData = await TemporalAnalysis.create({
        fieldId,
        period,
        vegetationHealth,
        moisture,
        environmentalConditions,
        measurementDate: new Date()
    });

    return res
        .status(201)
        .json(new ApiResponse(201, temporalData, "Temporal analysis data created successfully"));
});

const getTemporalAnalysis = asyncHandler(async (req, res) => {
    const { fieldId } = req.params;
    const { period = '6M', limit = 12 } = req.query;

    // Verify field ownership
    const field = await Field.findOne({ _id: fieldId, owner: req.user._id });
    if (!field) {
        throw new ApiError(404, "Field not found or access denied");
    }

    const temporalData = await TemporalAnalysis.find({ 
        fieldId, 
        period 
    })
    .sort({ measurementDate: -1 })
    .limit(parseInt(limit));

    // Calculate trends
    const trends = calculateTrends(temporalData);

    return res
        .status(200)
        .json(new ApiResponse(200, {
            fieldId,
            fieldName: field.name,
            period,
            data: temporalData,
            trends
        }, "Temporal analysis retrieved successfully"));
});

const getTemporalTrends = asyncHandler(async (req, res) => {
    const { fieldId } = req.params;
    const { period = '6M' } = req.query;

    // Verify field ownership
    const field = await Field.findOne({ _id: fieldId, owner: req.user._id });
    if (!field) {
        throw new ApiError(404, "Field not found or access denied");
    }

    const temporalData = await TemporalAnalysis.find({ 
        fieldId, 
        period 
    })
    .sort({ measurementDate: 1 });

    if (temporalData.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, {
                fieldId,
                fieldName: field.name,
                period,
                trends: {
                    vegetationHealth: { trend: 'stable', change: 0 },
                    moisture: { trend: 'stable', change: 0 },
                    environmentalConditions: { trend: 'stable', change: 0 }
                }
            }, "No temporal data available"));
    }

    const trends = calculateTrends(temporalData);

    return res
        .status(200)
        .json(new ApiResponse(200, {
            fieldId,
            fieldName: field.name,
            period,
            trends,
            dataPoints: temporalData.length
        }, "Temporal trends retrieved successfully"));
});

const getEnvironmentalConditions = asyncHandler(async (req, res) => {
    const { fieldId } = req.params;
    const { period = '6M', limit = 12 } = req.query;

    // Verify field ownership
    const field = await Field.findOne({ _id: fieldId, owner: req.user._id });
    if (!field) {
        throw new ApiError(404, "Field not found or access denied");
    }

    const environmentalData = await TemporalAnalysis.find({ 
        fieldId, 
        period 
    })
    .select('environmentalConditions measurementDate')
    .sort({ measurementDate: -1 })
    .limit(parseInt(limit));

    return res
        .status(200)
        .json(new ApiResponse(200, {
            fieldId,
            fieldName: field.name,
            period,
            environmentalData
        }, "Environmental conditions retrieved successfully"));
});

const getVegetationMoistureData = asyncHandler(async (req, res) => {
    const { fieldId } = req.params;
    const { period = '6M', limit = 12 } = req.query;

    // Verify field ownership
    const field = await Field.findOne({ _id: fieldId, owner: req.user._id });
    if (!field) {
        throw new ApiError(404, "Field not found or access denied");
    }

    const vegetationMoistureData = await TemporalAnalysis.find({ 
        fieldId, 
        period 
    })
    .select('vegetationHealth moisture measurementDate')
    .sort({ measurementDate: -1 })
    .limit(parseInt(limit));

    return res
        .status(200)
        .json(new ApiResponse(200, {
            fieldId,
            fieldName: field.name,
            period,
            vegetationMoistureData
        }, "Vegetation and moisture data retrieved successfully"));
});

// Helper function to calculate trends
function calculateTrends(data) {
    if (data.length < 2) {
        return {
            vegetationHealth: { trend: 'stable', change: 0 },
            moisture: { trend: 'stable', change: 0 },
            environmentalConditions: { trend: 'stable', change: 0 }
        };
    }

    const first = data[0];
    const last = data[data.length - 1];

    const vegetationChange = last.vegetationHealth - first.vegetationHealth;
    const moistureChange = last.moisture - first.moisture;
    const tempChange = last.environmentalConditions.temperature - first.environmentalConditions.temperature;

    return {
        vegetationHealth: {
            trend: vegetationChange > 0 ? 'increasing' : vegetationChange < 0 ? 'decreasing' : 'stable',
            change: Math.round(vegetationChange * 100) / 100
        },
        moisture: {
            trend: moistureChange > 0 ? 'increasing' : moistureChange < 0 ? 'decreasing' : 'stable',
            change: Math.round(moistureChange * 100) / 100
        },
        environmentalConditions: {
            trend: tempChange > 0 ? 'increasing' : tempChange < 0 ? 'decreasing' : 'stable',
            change: Math.round(tempChange * 100) / 100
        }
    };
}

export {
    createTemporalData,
    getTemporalAnalysis,
    getTemporalTrends,
    getEnvironmentalConditions,
    getVegetationMoistureData
};
