import { SpectralHealth } from "../models/spectralHealth.model.js";
import { Field } from "../models/field.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createSpectralHealthData = asyncHandler(async (req, res) => {
    const { fieldId, zoneId, ndviValue, healthPercentage, coordinates, sensorData } = req.body;

    if (!fieldId || !zoneId || !ndviValue || !healthPercentage) {
        throw new ApiError(400, "Required fields: fieldId, zoneId, ndviValue, healthPercentage");
    }

    // Verify field ownership
    const field = await Field.findOne({ fieldId: fieldId, owner: req.user._id });
    if (!field) {
        throw new ApiError(404, "Field not found or access denied");
    }

    // Determine health status based on percentage
    let healthStatus;
    if (healthPercentage >= 80) healthStatus = 'excellent';
    else if (healthPercentage >= 60) healthStatus = 'good';
    else if (healthPercentage >= 40) healthStatus = 'fair';
    else healthStatus = 'poor';

    const spectralData = await SpectralHealth.create({
        fieldId: field._id,
        zoneId,
        ndviValue,
        healthPercentage,
        healthStatus,
        coordinates,
        sensorData,
        measurementDate: new Date()
    });

    return res
        .status(201)
        .json(new ApiResponse(201, spectralData, "Spectral health data created successfully"));
});

const getSpectralHealthMap = asyncHandler(async (req, res) => {
    const { fieldId } = req.params;
    const { limit = 50 } = req.query;

    // Verify field ownership
    const field = await Field.findOne({ fieldId: fieldId, owner: req.user._id });
    if (!field) {
        throw new ApiError(404, "Field not found or access denied");
    }

    const spectralData = await SpectralHealth.find({ fieldId: field._id })
        .sort({ measurementDate: -1 })
        .limit(parseInt(limit));

    // Group by zone for map display
    const zoneMap = {};
    spectralData.forEach(data => {
        if (!zoneMap[data.zoneId]) {
            zoneMap[data.zoneId] = {
                zoneId: data.zoneId,
                healthPercentage: data.healthPercentage,
                healthStatus: data.healthStatus,
                coordinates: data.coordinates,
                measurementDate: data.measurementDate
            };
        }
    });

    return res
        .status(200)
        .json(new ApiResponse(200, {
            fieldId,
            fieldName: field.name,
            spectralMap: Object.values(zoneMap),
            totalZones: Object.keys(zoneMap).length
        }, "Spectral health map retrieved successfully"));
});

const getSpectralHealthByZone = asyncHandler(async (req, res) => {
    const { fieldId, zoneId } = req.params;
    const { limit = 10 } = req.query;

    // Verify field ownership
    const field = await Field.findOne({ fieldId: fieldId, owner: req.user._id });
    if (!field) {
        throw new ApiError(404, "Field not found or access denied");
    }

    const spectralData = await SpectralHealth.find({ 
        fieldId: field._id, 
        zoneId 
    })
    .sort({ measurementDate: -1 })
    .limit(parseInt(limit));

    return res
        .status(200)
        .json(new ApiResponse(200, {
            fieldId,
            zoneId,
            data: spectralData
        }, "Spectral health data for zone retrieved successfully"));
});

const getSpectralHealthSummary = asyncHandler(async (req, res) => {
    const { fieldId } = req.params;

    // Verify field ownership
    const field = await Field.findOne({ fieldId: fieldId, owner: req.user._id });
    if (!field) {
        throw new ApiError(404, "Field not found or access denied");
    }

    const summary = await SpectralHealth.aggregate([
        { $match: { fieldId: field._id } },
        {
            $group: {
                _id: null,
                totalZones: { $addToSet: "$zoneId" },
                avgHealthPercentage: { $avg: "$healthPercentage" },
                avgNdviValue: { $avg: "$ndviValue" },
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
            averageHealthPercentage: summary[0]?.avgHealthPercentage || 0,
            averageNdviValue: summary[0]?.avgNdviValue || 0,
            healthStatusDistribution: healthStatusCounts
        }, "Spectral health summary retrieved successfully"));
});

const updateSpectralHealthData = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const spectralData = await SpectralHealth.findById(id);
    if (!spectralData) {
        throw new ApiError(404, "Spectral health data not found");
    }

    // Verify field ownership
    const field = await Field.findOne({ _id: spectralData.fieldId, owner: req.user._id });
    if (!field) {
        throw new ApiError(403, "Access denied");
    }

    // Update health status if health percentage is being updated
    if (updateData.healthPercentage !== undefined) {
        let healthStatus;
        if (updateData.healthPercentage >= 80) healthStatus = 'excellent';
        else if (updateData.healthPercentage >= 60) healthStatus = 'good';
        else if (updateData.healthPercentage >= 40) healthStatus = 'fair';
        else healthStatus = 'poor';
        updateData.healthStatus = healthStatus;
    }

    const updatedData = await SpectralHealth.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updatedData, "Spectral health data updated successfully"));
});

export {
    createSpectralHealthData,
    getSpectralHealthMap,
    getSpectralHealthByZone,
    getSpectralHealthSummary,
    updateSpectralHealthData
};
