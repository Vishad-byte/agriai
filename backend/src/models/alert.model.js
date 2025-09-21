import mongoose, { Schema } from "mongoose";

const alertSchema = new Schema({
    fieldId: {
        type: Schema.Types.ObjectId,
        ref: 'Field',
        required: true
    },
    zoneId: {
        type: String,
        required: true
    },
    alertType: {
        type: String,
        enum: ['drought', 'pest', 'disease', 'irrigation', 'nutrient', 'weather', 'equipment'],
        required: true
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'acknowledged', 'resolved', 'dismissed'],
        default: 'active'
    },
    priority: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
    },
    detectedAt: {
        type: Date,
        default: Date.now
    },
    resolvedAt: {
        type: Date
    },
    aiConfidence: {
        type: Number,
        min: 0,
        max: 100,
        default: 85
    },
    metadata: {
        sensorData: Schema.Types.Mixed,
        weatherConditions: Schema.Types.Mixed,
        recommendations: [String]
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

// Index for efficient queries
alertSchema.index({ fieldId: 1, status: 1, detectedAt: -1 });
alertSchema.index({ severity: 1, status: 1 });
alertSchema.index({ owner: 1, status: 1 });

export const Alert = mongoose.model("Alert", alertSchema);
