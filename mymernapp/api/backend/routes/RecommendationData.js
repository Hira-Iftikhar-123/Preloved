const express = require('express')
const router = express.Router()
const Order = require('../models/Orders')
const Recommendation = require('../models/Recommendation')
const Dress = require('../models/Dress');

router.post('/generateRecommendations', async (req, res) => {
    try {
        const { email } = req.body;
        
        const userOrders = await Order.findOne({ email });
        if (!userOrders) {
            return res.json({ recommendations: [] });
        }

        const allItems = await Dress.find();

        const preferences = {
            categories: new Set(),
            priceRange: { min: Infinity, max: 0 },
            brands: new Set()
        };

        userOrders.order_data.forEach(orderGroup => {
            orderGroup.forEach(item => {
                if (!item.Order_Date) {
                    const category = item.categoryname;
                    const price = item.price;
                    const brand = item.name;

                    if (category) preferences.categories.add(category);
                    if (price) {
                        preferences.priceRange.min = Math.min(preferences.priceRange.min, price);
                        preferences.priceRange.max = Math.max(preferences.priceRange.max, price);
                    }
                    if (brand) preferences.brands.add(brand);
                }
            });
        });

        preferences.categories = Array.from(preferences.categories);
        preferences.brands = Array.from(preferences.brands);

        const recommendations = allItems
            .filter(item => {
                const hasPurchased = userOrders.order_data.some(orderGroup =>
                    orderGroup.some(orderItem => orderItem.id === item._id.toString())
                );
                if (hasPurchased) return false;
                const matchesCategory = preferences.categories.includes(item.category);
                const matchesBrand = preferences.brands.includes(item.brand);
                const price = Math.min(...Object.values(item.sizes).map(Number));
                const matchesPriceRange = price >= preferences.priceRange.min * 0.7 && 
                                        price <= preferences.priceRange.max * 1.3;

                return matchesCategory || matchesBrand || matchesPriceRange;
            })
            .map(item => ({
                productId: item._id,
                score: calculateScore(item, preferences),
                category: item.category,
                lastUpdated: new Date()
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
        await Recommendation.findOneAndUpdate(
            { email },
            {
                email,
                recommendations,
                preferences: {
                    categories: preferences.categories,
                    priceRange: preferences.priceRange,
                    brands: preferences.brands
                }
            },
            { upsert: true }
        );

        res.json({ recommendations });
    } catch (error) {
        console.error('Error generating recommendations:', error);
        res.status(500).send('Server Error');
    }
});

router.post('/getRecommendations', async (req, res) => {
    try {
        const { email } = req.body;
        const recommendation = await Recommendation.findOne({ email });
        
        if (!recommendation) {
            return res.json({ recommendations: [] });
        }

        const allItems = await Dress.find();
        const recommendedProducts = recommendation.recommendations
            .map(rec => {
                const product = allItems.find(item => 
                    item._id.toString() === rec.productId
                );
                return product ? { ...product.toObject(), recommendationScore: rec.score } : null;
            })
            .filter(Boolean);

        res.json({ recommendations: recommendedProducts });
    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).send('Server Error');
    }
});

function calculateScore(item, preferences) {
    let score = 0;
    
    if (preferences.categories.includes(item.category)) {
        score += 3;
    }
    
    if (preferences.brands.includes(item.brand)) {
        score += 2;
    }
    
    const price = Math.min(...Object.values(item.sizes).map(Number));
    if (price >= preferences.priceRange.min * 0.7 && price <= preferences.priceRange.max * 1.3) {
        score += 2;
    }
    
    return score;
}

module.exports = router; 