const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'User'
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:'Product'
    },
    created_At: {
        type: Date,
        default: Date.now
    },
});

// Create and export the OTP model
const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
