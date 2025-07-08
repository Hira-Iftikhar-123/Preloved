const express = require('express');
const router = express.Router();
const Dress = require('../models/Dress');

router.post('/ClothingData', async (req, res) => {
    try {
        const dresses = await Dress.find();
        res.send([dresses, global.clothingCategories]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error while fetching dress data.');
    }
});

module.exports = router;