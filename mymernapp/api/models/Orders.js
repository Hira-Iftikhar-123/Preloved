const mongoose = require('mongoose')

const { Schema } = mongoose;

const OrderSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    order_data: {
        type: Array,
        required: true
    },
    delivery_details: {
        fullName: String,
        address: String,
        city: String,
        phone: String,
        payment_method: {
            type: String,
            default: 'Cash on Delivery'
        }
    }
});

module.exports = mongoose.model('order',OrderSchema) 