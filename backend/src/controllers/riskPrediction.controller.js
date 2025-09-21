import { RiskPrediction } from "../models/riskPrediction.model.js";
import { Field } from "../models/field.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createRiskPrediction = asyncHandler(async (req, res) => {
    const { 
        fieldId, 
        zoneId, 
        riskLevel, 
        riskType, 
        probability, 
        aiConfidence,
        coordinates,
        timeHorizon,
        factors,
        recommendations 
    } = req.body;

    if (!fieldId || !zoneId || !riskLevel || !riskType || !probability || !aiConfidence) {
        throw new ApiError(400, "Required fields: fieldId, zoneId, riskLevel, riskType, probability, aiConfidence");
    }

    // Verify field ownership
    const field = await Field.findOne({ fieldId: fieldId, owner: req.user._id });
    if (!field) {
        throw new ApiError(404, "Field not found or access denied");
    }

    const riskPrediction = await RiskPrediction.create({
        fieldId: field._id,
        zoneId,
        riskLevel,
        riskType,
        probability,
        aiConfidence,
        coordinates,
        timeHorizon: timeHorizon || '1week',
        factors,
        recommendations,
        owner: req.user._id
    });

    return res
        .status(201)
        .json(new ApiResponse(201, riskPrediction, "Risk prediction created successfully"));
});

const getRiskPredictions = asyncHandler(async (req, res) => {
    const { fieldId } = req.params;
    const { riskLevel, riskType, timeHorizon, limit = 20 } = req.query;

    // Verify field ownership
    const field = await Field.findOne({ fieldId: fieldId, owner: req.user._id });
    if (!field) {
        throw new ApiError(404, "Field not found or access denied");
    }

    const filter = { fieldId: field._id, owner: req.user._id };
    if (riskLevel) filter.riskLevel = riskLevel;
    if (riskType) filter.riskType = riskType;
    if (timeHorizon) filter.timeHorizon = timeHorizon;

    const riskPredictions = await RiskPrediction.find(filter)
        .sort({ predictionDate: -1 })
        .limit(parseInt(limit));

    return res
        .status(200)
        .json(new ApiResponse(200, {
            fieldId,
            fieldName: field.name,
            riskPredictions
        }, "Risk predictions retrieved successfully"));
});

const getRiskZoneMap = asyncHandler(async (req, res) => {
    const { fieldId } = req.params;
    const { timeHorizon = '1week' } = req.query;

    // Verify field ownership
    const field = await Field.findOne({ fieldId: fieldId, owner: req.user._id });
    if (!field) {
        throw new ApiError(404, "Field not found or access denied");
    }

    const riskZones = await RiskPrediction.find({ 
        fieldId: field._id, 
        timeHorizon,
        owner: req.user._id 
    })
    .sort({ predictionDate: -1 });

    // Group by coordinates for map display
    const zoneMap = {};
    riskZones.forEach(risk => {
        const key = `${risk.coordinates.x}-${risk.coordinates.y}`;
        if (!zoneMap[key]) {
            zoneMap[key] = {
                coordinates: risk.coordinates,
                riskLevel: risk.riskLevel,
                riskType: risk.riskType,
                probability: risk.probability,
                aiConfidence: risk.aiConfidence,
                zoneId: risk.zoneId
            };
        }
    });

    // Calculate risk distribution
    const riskDistribution = {
        high: riskZones.filter(r => r.riskLevel === 'high').length,
        medium: riskZones.filter(r => r.riskLevel === 'medium').length,
        low: riskZones.filter(r => r.riskLevel === 'low').length
    };

    return res
        .status(200)
        .json(new ApiResponse(200, {
            fieldId,
            fieldName: field.name,
            timeHorizon,
            riskZoneMap: Object.values(zoneMap),
            riskDistribution,
            totalZones: Object.keys(zoneMap).length
        }, "Risk zone map retrieved successfully"));
});

const getRiskSummary = asyncHandler(async (req, res) => {
    const { fieldId } = req.params;

    // Verify field ownership
    const field = await Field.findOne({ fieldId: fieldId, owner: req.user._id });
    if (!field) {
        throw new ApiError(404, "Field not found or access denied");
    }

    const riskSummary = await RiskPrediction.aggregate([
        { $match: { fieldId: field._id, owner: req.user._id } },
        {
            $group: {
                _id: null,
                totalPredictions: { $sum: 1 },
                highRiskZones: {
                    $sum: { $cond: [{ $eq: ["$riskLevel", "high"] }, 1, 0] }
                },
                mediumRiskZones: {
                    $sum: { $cond: [{ $eq: ["$riskLevel", "medium"] }, 1, 0] }
                },
                lowRiskZones: {
                    $sum: { $cond: [{ $eq: ["$riskLevel", "low"] }, 1, 0] }
                },
                avgProbability: { $avg: "$probability" },
                avgAiConfidence: { $avg: "$aiConfidence" }
            }
        }
    ]);

    const riskTypes = await RiskPrediction.aggregate([
        { $match: { fieldId: field._id, owner: req.user._id } },
        {
            $group: {
                _id: "$riskType",
                count: { $sum: 1 },
                avgProbability: { $avg: "$probability" }
            }
        }
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, {
            fieldId,
            fieldName: field.name,
            summary: riskSummary[0] || {
                totalPredictions: 0,
                highRiskZones: 0,
                mediumRiskZones: 0,
                lowRiskZones: 0,
                avgProbability: 0,
                avgAiConfidence: 0
            },
            riskTypes
        }, "Risk summary retrieved successfully"));
});

const getHighRiskZones = asyncHandler(async (req, res) => {
    const { fieldId } = req.params;
    const { limit = 10 } = req.query;

    // Verify field ownership
    const field = await Field.findOne({ fieldId: fieldId, owner: req.user._id });
    if (!field) {
        throw new ApiError(404, "Field not found or access denied");
    }

    const highRiskZones = await RiskPrediction.find({ 
        fieldId: field._id, 
        riskLevel: 'high',
        owner: req.user._id 
    })
    .sort({ probability: -1, predictionDate: -1 })
    .limit(parseInt(limit));

    return res
        .status(200)
        .json(new ApiResponse(200, {
            fieldId,
            fieldName: field.name,
            highRiskZones
        }, "High risk zones retrieved successfully"));
});

const getRiskRecommendations = asyncHandler(async (req, res) => {
    const { fieldId } = req.params;
    const { riskType, riskLevel } = req.query;

    // Verify field ownership
    const field = await Field.findOne({ fieldId: fieldId, owner: req.user._id });
    if (!field) {
        throw new ApiError(404, "Field not found or access denied");
    }

    const filter = { fieldId: field._id, owner: req.user._id };
    if (riskType) filter.riskType = riskType;
    if (riskLevel) filter.riskLevel = riskLevel;

    const riskPredictions = await RiskPrediction.find(filter)
    .select('riskType riskLevel probability recommendations')
    .sort({ probability: -1 });

    // Extract and organize recommendations
    const allRecommendations = [];
    riskPredictions.forEach(risk => {
        if (risk.recommendations && risk.recommendations.length > 0) {
            risk.recommendations.forEach(rec => {
                allRecommendations.push({
                    ...rec,
                    riskType: risk.riskType,
                    riskLevel: risk.riskLevel,
                    probability: risk.probability
                });
            });
        }
    });

    // Sort by priority
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    allRecommendations.sort((a, b) => 
        (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
    );

    return res
        .status(200)
        .json(new ApiResponse(200, {
            fieldId,
            fieldName: field.name,
            recommendations: allRecommendations.slice(0, 20) // Limit to top 20
        }, "Risk recommendations retrieved successfully"));
});

export {
    createRiskPrediction,
    getRiskPredictions,
    getRiskZoneMap,
    getRiskSummary,
    getHighRiskZones,
    getRiskRecommendations
};
