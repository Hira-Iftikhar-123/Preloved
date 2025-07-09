const mongoose = require('mongoose')

const { Schema } = mongoose;

const DressSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    sizes: {
        small: {
            type: String,
            required: true
        },
        medium: {
            type: String,
            required: true
        },
        large: {
            type: String,
            required: true
        }
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
DressSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('dress', DressSchema); 