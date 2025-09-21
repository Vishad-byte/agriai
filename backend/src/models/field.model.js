import mongoose, { Schema } from "mongoose";

const fieldSchema = new Schema({
    fieldId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    area: {
        type: Number,
        required: true // in acres
    },
    cropType: {
        type: String,
        required: true
    },
    plantingDate: {
        type: Date,
        required: true
    },
    expectedHarvestDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'maintenance'],
        default: 'active'
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export const Field = mongoose.model("Field", fieldSchema);
