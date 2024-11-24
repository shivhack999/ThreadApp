const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

const productSchema = mongoose.Schema({
    // serial_number: {
    //     type: Number,
    //     unique: true // Ensure that serial numbers are unique
    // },
    title:{
        type:String,
        required:true,
    },
    vendor:{
        type:String,
        required:true,
    },
    product_type:{
        type:mongoose.Schema.Types.String,
        ref:'SubSubCategory',
        required:true
    },
    created_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Employee',
        required:true
    },
    updated_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'EMployee'
    },
    published_at:{
        type:Date,
    },
    targetAudience:{
        type: String,
        enum: ['male', 'female', 'children', 'unisex'],
        required: true
    },
    brand:{
        type:mongoose.Schema.Types.String,
        ref:'Brand',
        required:true
    },
    create_At:{
        type:Date,
        default:Date.now
    },
    update_At:{
        type:Date
    },




    quantity:{
        type:Number,
        required:true,
        default:0
    },
    color:{
        type:[String],
        required:true
    },
    material:{
        type:[String],
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
    images:{
        type:[String],
        required:true
    },
    keywords:{
        type:[String]
    },
    
})
// Apply the AutoIncrement plugin to the serial_number field
// productSchema.plugin(AutoIncrement, { inc_field: 'serial_number' });


const product = mongoose.model("Product", productSchema);
module.exports = product;
