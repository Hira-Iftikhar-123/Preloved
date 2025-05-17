const mongoose = require('mongoose');
require('dotenv').config();
const mongoURL = process.env.MONGO_URI

const mongoDB = async () => {
    try {
        await mongoose.connect(mongoURL, {});

        console.log("MongoDB connected successfully");

        const db = mongoose.connection.db;

        const clothingItemsCollection = db.collection("clothing_items");
        const clothingCategoriesCollection = db.collection("clothingCategories");

        const [items, categories] = await Promise.all([
            clothingItemsCollection.find({}).toArray(),
            clothingCategoriesCollection.find({}).toArray()
        ]);

        global.clothing_items = items;
        global.clothingCategories = categories;

        // console.log(items);
        // console.log(categories);

    } catch (err) {
        console.error("MongoDB connection error:", err.message);
    }
};

module.exports = mongoDB;
