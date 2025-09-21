import mongoose, { Schema } from "mongoose";

const soilHealthSchema = new Schema({
    fieldId: {
        type: Schema.Types.ObjectId,
        ref: 'Field',
        required: true
    },
    zoneId: {
        type: String,
        required: true
    },
    phLevel: {
        type: Number,
        required: true,
        min: 0,
        max: 14
    },
    moisture: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    nitrogen: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    phosphorus: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    potassium: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    organicMatter: {
        type: Number,
        min: 0,
        max: 100
    },
    soilTemperature: {
        type: Number
    },
    soilType: {
        type: String,
        enum: ['clay', 'sandy', 'loamy', 'silty', 'peaty', 'chalky']
    },
    healthStatus: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor'],
        required: true
    },
    healthScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    measurementDate: {
        type: Date,
        default: Date.now
    },
    recommendations: [{
        type: String,
        category: String,
        priority: {
            type: String,
            enum: ['low', 'medium', 'high']
        }
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

// Index for efficient queries
soilHealthSchema.index({ fieldId: 1, measurementDate: -1 });
soilHealthSchema.index({ zoneId: 1, healthStatus: 1 });
soilHealthSchema.index({ owner: 1, measurementDate: -1 });

export const SoilHealth = mongoose.model("SoilHealth", soilHealthSchema);
