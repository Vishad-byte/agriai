import mongoose, { Schema } from "mongoose";

const temporalAnalysisSchema = new Schema({
    fieldId: {
        type: Schema.Types.ObjectId,
        ref: 'Field',
        required: true
    },
    period: {
        type: String,
        enum: ['6M', '1Y'],
        required: true
    },
    vegetationHealth: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    moisture: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    environmentalConditions: {
        temperature: {
            type: Number,
            required: true
        },
        humidity: {
            type: Number,
            required: true
        },
        rainfall: {
            type: Number,
            required: true
        }
    },
    measurementDate: {
        type: Date,
        required: true
    },
    trendData: {
        vegetationTrend: {
            type: String,
            enum: ['increasing', 'decreasing', 'stable'],
            default: 'stable'
        },
        moistureTrend: {
            type: String,
            enum: ['increasing', 'decreasing', 'stable'],
            default: 'stable'
        }
    }
}, { timestamps: true });

// Index for efficient queries
temporalAnalysisSchema.index({ fieldId: 1, measurementDate: -1 });
temporalAnalysisSchema.index({ period: 1, measurementDate: -1 });

export const TemporalAnalysis = mongoose.model("TemporalAnalysis", temporalAnalysisSchema);
