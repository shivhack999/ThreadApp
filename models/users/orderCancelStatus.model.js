const mongoose = require('mongoose')


const orderCancelStatusSchema = mongoose.Schema({
    orderId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Order'
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Users'
    },
    quantity:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:['Pending','Received'],
        required:true,
        default:'Pending'
    },
    create_At:{
        type:Date,
        default:Date.now,
        required:true
    },
    updated_At:{
        type:Date
    }
});

const OrderStatus = mongoose.model("OrderCancelStatus", orderCancelStatusSchema);

module.exports = OrderStatus;
