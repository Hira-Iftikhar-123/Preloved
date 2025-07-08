const express = require('express');
const router = express.Router();
const Dress = require('../models/Dress');

// Get all available dresses for users
router.get('/dresses', async (req, res) => {
    try {
        const dresses = await Dress.find({ isAvailable: true }).sort({ createdAt: -1 });
        res.json(dresses);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dresses' });
    }
});

module.exports = router; 