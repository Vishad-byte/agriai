import { Alert } from "../models/alert.model.js";
import { Field } from "../models/field.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createAlert = asyncHandler(async (req, res) => {
    const { 
        fieldId, 
        zoneId, 
        alertType, 
        severity, 
        title, 
        description, 
        aiConfidence,
        metadata 
    } = req.body;

    if (!fieldId || !zoneId || !alertType || !severity || !title || !description) {
        throw new ApiError(400, "Required fields: fieldId, zoneId, alertType, severity, title, description");
    }

    // Verify field ownership
    const field = await Field.findOne({ _id: fieldId, owner: req.user._id });
    if (!field) {
        throw new ApiError(404, "Field not found or access denied");
    }

    const alert = await Alert.create({
        fieldId,
        zoneId,
        alertType,
        severity,
        title,
        description,
        aiConfidence: aiConfidence || 85,
        metadata,
        owner: req.user._id
    });

    return res
        .status(201)
        .json(new ApiResponse(201, alert, "Alert created successfully"));
});

const getActiveAlerts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, severity, alertType } = req.query;
    const skip = (page - 1) * limit;

    const filter = { 
        owner: req.user._id, 
        status: 'active' 
    };

    if (severity) filter.severity = severity;
    if (alertType) filter.alertType = alertType;

    const alerts = await Alert.find(filter)
        .populate('fieldId', 'name fieldId')
        .sort({ detectedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const totalAlerts = await Alert.countDocuments(filter);

    return res
        .status(200)
        .json(new ApiResponse(200, {
            alerts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalAlerts / limit),
                totalAlerts,
                hasNext: page * limit < totalAlerts,
                hasPrev: page > 1
            }
        }, "Active alerts retrieved successfully"));
});

const getAlertsByField = asyncHandler(async (req, res) => {
    const { fieldId } = req.params;
    const { status = 'active', limit = 10 } = req.query;

    // Verify field ownership
    const field = await Field.findOne({ _id: fieldId, owner: req.user._id });
    if (!field) {
        throw new ApiError(404, "Field not found or access denied");
    }

    const alerts = await Alert.find({ 
        fieldId, 
        status,
        owner: req.user._id 
    })
    .sort({ detectedAt: -1 })
    .limit(parseInt(limit));

    return res
        .status(200)
        .json(new ApiResponse(200, {
            fieldId,
            fieldName: field.name,
            alerts
        }, "Field alerts retrieved successfully"));
});

const updateAlertStatus = asyncHandler(async (req, res) => {
    const { alertId } = req.params;
    const { status } = req.body;

    if (!status || !['active', 'acknowledged', 'resolved', 'dismissed'].includes(status)) {
        throw new ApiError(400, "Valid status required: active, acknowledged, resolved, dismissed");
    }

    const updateData = { status };
    if (status === 'resolved') {
        updateData.resolvedAt = new Date();
    }

    const alert = await Alert.findOneAndUpdate(
        { _id: alertId, owner: req.user._id },
        updateData,
        { new: true, runValidators: true }
    );

    if (!alert) {
        throw new ApiError(404, "Alert not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, alert, "Alert status updated successfully"));
});

const getAlertSummary = asyncHandler(async (req, res) => {
    const summary = await Alert.aggregate([
        { $match: { owner: req.user._id } },
        {
            $group: {
                _id: null,
                totalAlerts: { $sum: 1 },
                activeAlerts: {
                    $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] }
                },
                resolvedAlerts: {
                    $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] }
                },
                criticalAlerts: {
                    $sum: { $cond: [{ $eq: ["$severity", "critical"] }, 1, 0] }
                },
                highAlerts: {
                    $sum: { $cond: [{ $eq: ["$severity", "high"] }, 1, 0] }
                },
                mediumAlerts: {
                    $sum: { $cond: [{ $eq: ["$severity", "medium"] }, 1, 0] }
                },
                lowAlerts: {
                    $sum: { $cond: [{ $eq: ["$severity", "low"] }, 1, 0] }
                }
            }
        }
    ]);

    const alertTypes = await Alert.aggregate([
        { $match: { owner: req.user._id, status: 'active' } },
        {
            $group: {
                _id: "$alertType",
                count: { $sum: 1 }
            }
        }
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, {
            summary: summary[0] || {
                totalAlerts: 0,
                activeAlerts: 0,
                resolvedAlerts: 0,
                criticalAlerts: 0,
                highAlerts: 0,
                mediumAlerts: 0,
                lowAlerts: 0
            },
            alertTypes
        }, "Alert summary retrieved successfully"));
});

const getRecentAlerts = asyncHandler(async (req, res) => {
    const { limit = 5 } = req.query;

    const recentAlerts = await Alert.find({ 
        owner: req.user._id 
    })
    .populate('fieldId', 'name fieldId')
    .sort({ detectedAt: -1 })
    .limit(parseInt(limit));

    return res
        .status(200)
        .json(new ApiResponse(200, {
            recentAlerts
        }, "Recent alerts retrieved successfully"));
});

export {
    createAlert,
    getActiveAlerts,
    getAlertsByField,
    updateAlertStatus,
    getAlertSummary,
    getRecentAlerts
};
