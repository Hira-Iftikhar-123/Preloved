const express = require('express');
const router = express.Router();

router.post('/ClothingData', (req,res) => {
    try
    {
        res.send([global.clothing_items,global.clothingCategories]);

    }
    catch(error)
    {
        console.error(error.message);
        res.status(500).send('Server error while fetching clothing data.');
    }
})
 
module.exports = router;