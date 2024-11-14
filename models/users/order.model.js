const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    trackingId: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Products',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    delivery_status: {
        type: String,
        enum: ['Success', 'Reject', 'Cancelled', 'Pending'],
        default: 'Pending'
    },
    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    },
    payment_status: {
        type: String,
        enum: ['Pending', 'Success'],
        required: true
    },
    payment_mode: {
        type: String,
        enum: ['Online', 'Cash on delivery'],
        required: true
    },
    transactionId: {
        type: String
    },
    create_At: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated_At:{
        type: Date,
        required: true
    }
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
