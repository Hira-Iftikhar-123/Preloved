const mongoose = require('mongoose');
require('dotenv').config();
const mongoURL = process.env.MONGODB_URI

const mongoDB = async () => {
    try {
        await mongoose.connect(mongoURL, {});
        console.log("MongoDB connected successfully");
        const db = mongoose.connection.db;
        const clothingCategoriesCollection = db.collection("clothingCategories");
        const categories = await clothingCategoriesCollection.find({}).toArray();
        global.clothingCategories = categories;
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
    }
};

module.exports = mongoDB;
