const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const quantityRuleSchema = new mongoose.Schema({
    min:{
        type:Number,
        required:true
    },
    increment:{
        type:Number,
        required:true,
        default:1
    }
})
const variantSchema = new mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    serial_number: {
        type: Number,
        unique: true // Ensure that serial numbers are unique
    },
    title:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true,
        default:0
    },
    color:{
        type:String,
        required:true
    },
    order_count:{
        type:Number,
        default:0
    },
    material:{
        type:String,
        required:true
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
    size:{
        type:String,
        required:true
    },
    barcode:{
        type:String
    },
    taxable:{
        type:Boolean,
        required:true,
    },
    quantity_rule:{
        type:quantityRuleSchema,
        required:true
    },
    price_currency:{
        type:String,
        default:"INR"
    },
    created_By:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Employee',
        required:true
    },
    updated_By:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'EMployee'
    },
    created_At:{
        type:Date,
        default:Date.now
    },
    updated_At:{
        type:Date
    },
})
// Apply the AutoIncrement plugin to the serial_number field
variantSchema.plugin(AutoIncrement, { inc_field: 'serial_number' });
const Variant = mongoose.model("Variant", variantSchema);
module.exports = Variant;