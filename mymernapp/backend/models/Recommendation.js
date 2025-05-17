const mongoose = require('mongoose')

const { Schema } = mongoose;

const RecommendationSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    recommendations: [{
        productId: String,
        score: Number,
        category: String,
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    }],
    preferences: {
        categories: [String],
        priceRange: {
            min: Number,
            max: Number
        },
        brands: [String]
    }
});

module.exports = mongoose.model('recommendation', RecommendationSchema) 