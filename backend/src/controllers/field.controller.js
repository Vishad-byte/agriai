import { Field } from "../models/field.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createField = asyncHandler(async (req, res) => {
    const { fieldId, name, location, area, cropType, plantingDate, expectedHarvestDate } = req.body;
    
    if (!fieldId || !name || !location || !area || !cropType || !plantingDate) {
        throw new ApiError(400, "All required fields must be provided");
    }

    const existingField = await Field.findOne({ fieldId });
    if (existingField) {
        throw new ApiError(409, "Field with this ID already exists");
    }

    const field = await Field.create({
        fieldId,
        name,
        location,
        area,
        cropType,
        plantingDate,
        expectedHarvestDate,
        owner: req.user._id
    });

    return res
        .status(201)
        .json(new ApiResponse(201, field, "Field created successfully"));
});

const getFields = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const filter = { owner: req.user._id };
    if (status) {
        filter.status = status;
    }

    const fields = await Field.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const totalFields = await Field.countDocuments(filter);

    return res
        .status(200)
        .json(new ApiResponse(200, {
            fields,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalFields / limit),
                totalFields,
                hasNext: page * limit < totalFields,
                hasPrev: page > 1
            }
        }, "Fields retrieved successfully"));
});

const getFieldById = asyncHandler(async (req, res) => {
    const { fieldId } = req.params;

    const field = await Field.findOne({ 
        fieldId, 
        owner: req.user._id 
    });

    if (!field) {
        throw new ApiError(404, "Field not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, field, "Field retrieved successfully"));
});

const updateField = asyncHandler(async (req, res) => {
    const { fieldId } = req.params;
    const updateData = req.body;

    const field = await Field.findOneAndUpdate(
        { fieldId, owner: req.user._id },
        updateData,
        { new: true, runValidators: true }
    );

    if (!field) {
        throw new ApiError(404, "Field not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, field, "Field updated successfully"));
});

const deleteField = asyncHandler(async (req, res) => {
    const { fieldId } = req.params;

    const field = await Field.findOneAndDelete({ 
        fieldId, 
        owner: req.user._id 
    });

    if (!field) {
        throw new ApiError(404, "Field not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Field deleted successfully"));
});

const getFieldSummary = asyncHandler(async (req, res) => {
    const totalFields = await Field.countDocuments({ owner: req.user._id });
    const activeFields = await Field.countDocuments({ 
        owner: req.user._id, 
        status: 'active' 
    });
    const inactiveFields = await Field.countDocuments({ 
        owner: req.user._id, 
        status: 'inactive' 
    });

    return res
        .status(200)
        .json(new ApiResponse(200, {
            totalFields,
            activeFields,
            inactiveFields,
            maintenanceFields: totalFields - activeFields - inactiveFields
        }, "Field summary retrieved successfully"));
});

export {
    createField,
    getFields,
    getFieldById,
    updateField,
    deleteField,
    getFieldSummary
};
