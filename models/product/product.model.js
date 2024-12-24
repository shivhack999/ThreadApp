const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    vendorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Vendor",
        required:true,
    },
    product_type:{  // sub_sub_categories = product_type
        type:mongoose.Schema.Types.ObjectId,
        ref:'SubSubCategory',
        required:true
    },
    published_At:{
        type:Date,
    },
    targetAudience:{
        type: [String],
        enum: ['Male', 'Female', 'Children', 'Unisex'],
        required: true
    },
    brand:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Brand',
        required:true
    },
    tags:{
        type:String, // "clothe, Sport, winter,"
        required:true,
    },
    created_By:{ // hold ID of employee which is add product 
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


const product = mongoose.model("Product", productSchema);
module.exports = product;
