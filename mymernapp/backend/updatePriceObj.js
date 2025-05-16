const mongoose = require('mongoose');

const mongoURL = 'mongodb+srv://preloved:12345@cluster0.zulxw.mongodb.net/preloved_mern?retryWrites=true&w=majority&appName=Cluster0';

async function updateClothingSizesToPrices() {
  try {
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("MongoDB connected.");

    const db = mongoose.connection.db;
    const clothingItemsCollection = db.collection("clothing_items");

    const items = await clothingItemsCollection.find({}).toArray();

    for (const item of items) {
      const oldSizes = item.sizes;

      // If sizes are currently booleans (e.g., {small: true})
      if (oldSizes && typeof oldSizes.small === 'boolean') {
        // Assign default prices per size
        const updatedSizes = {
          small: "2000",
          medium: "2500",
          large: "3000"
        };

        await clothingItemsCollection.updateOne(
          { _id: item._id },
          { $set: { sizes: updatedSizes } }
        );

        console.log(`Updated item ${item._id} to use price-based sizes`);
      } else {
        console.log(`Skipped item ${item._id} (already using price structure?)`);
      }
    }

    console.log("All applicable items updated.");
    mongoose.disconnect();

  } catch (error) {
    console.error("Error updating items:", error);
  }
}

updateClothingSizesToPrices();
