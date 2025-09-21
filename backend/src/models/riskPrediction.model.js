import mongoose, { Schema } from "mongoose";

const riskPredictionSchema = new Schema({
    fieldId: {
        type: Schema.Types.ObjectId,
        ref: 'Field',
        required: true
    },
    zoneId: {
        type: String,
        required: true
    },
    riskLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true
    },
    riskType: {
        type: String,
        enum: ['drought', 'pest', 'disease', 'weather', 'nutrient', 'equipment'],
        required: true
    },
    probability: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    aiConfidence: {
        type: Number,
        required: true,
        min: 0,
        max: 100
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
    predictionDate: {
        type: Date,
        default: Date.now
    },
    timeHorizon: {
        type: String,
        enum: ['1day', '3days', '1week', '2weeks', '1month'],
        required: true
    },
    factors: {
        weather: {
            temperature: Number,
            humidity: Number,
            rainfall: Number,
            windSpeed: Number
        },
        soil: {
            moisture: Number,
            ph: Number,
            nutrients: Schema.Types.Mixed
        },
        vegetation: {
            ndvi: Number,
            healthIndex: Number
        }
    },
    recommendations: [{
        action: String,
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical']
        },
        description: String
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

// Index for efficient queries
riskPredictionSchema.index({ fieldId: 1, predictionDate: -1 });
riskPredictionSchema.index({ riskLevel: 1, riskType: 1 });
riskPredictionSchema.index({ owner: 1, predictionDate: -1 });

export const RiskPrediction = mongoose.model("RiskPrediction", riskPredictionSchema);
