import mongoose, { Schema } from "mongoose";

const spectralHealthSchema = new Schema({
    fieldId: {
        type: Schema.Types.ObjectId,
        ref: 'Field',
        required: true
    },
    zoneId: {
        type: String,
        required: true // e.g., "A-1", "B-2", etc.
    },
    ndviValue: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },
    healthPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    healthStatus: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor'],
        required: true
    },
    coordinates: {
        x: {
            type: Number,
            required: true
        },
        y: {
            type: Number,
            required: true
        }
    },
    measurementDate: {
        type: Date,
        default: Date.now
    },
    sensorData: {
        vegetationIndex: Number,
        moistureIndex: Number,
        temperatureIndex: Number
    }
}, { timestamps: true });

// Index for efficient queries
spectralHealthSchema.index({ fieldId: 1, measurementDate: -1 });
spectralHealthSchema.index({ zoneId: 1, measurementDate: -1 });

export const SpectralHealth = mongoose.model("SpectralHealth", spectralHealthSchema);
