const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

const productSchema = mongoose.Schema({
    serial_number: {
        type: Number,
        unique: true // Ensure that serial numbers are unique
    },
    product_name:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
        default:0
    },
    category:{
        type:String,
        required:true,
        ref:'category'
    },
    sub_category:{
        type:String,
        required:true,
        ref:'sub_category'
    },
    sub_sub_category:{
        type:String,
        ref:'sub_sub_category'
    },
    brand:{
        type:String,
        ref:'Brand',
        required:true
    },
    color:{
        type:[String],
        required:true
    },
    material:{
        type:[String],
        required:true
    },
    targetAudience:{
        type: String,
        enum: ['male', 'female', 'children', 'unisex'],
        required: true
    },
    buy_price:{
        type:Number,
        required:true
    },
    sale_price:{
        type:Number,
        required:true
    },
    max_price:{
        type:Number,
        required:true
    },
    min_price:{
        type:Number,
        required:true
    },
    discount:{
        type:Number,
        default:0
    },
    description:{
        type:String,
        required:true
    },
    images:{
        type:[String],
        required:true
    },
    keywords:{
        type:[String]
    },
    create_At:{
        type:Date,
        default:Date.now
    },
    update_At:{
        type:Date,
        default:Date.now
    }
})
// Apply the AutoIncrement plugin to the serial_number field
productSchema.plugin(AutoIncrement, { inc_field: 'serial_number' });


const product = mongoose.model("Product", productSchema);
module.exports = product;
