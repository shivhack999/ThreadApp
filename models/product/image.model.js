const mongoose = require("mongoose")

const imageSchema = mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    variantId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Variant'
    },
    published_scope:{
        type:String,
        enum:["Web","App"],
        required:true
    },
    alt:{
        type:String,
        required:true
    },
    src:{
        type:String,
        required:true
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
    create_At:{
        type:Date,
        default:Date.now
    },
    update_At:{
        type:Date
    },
})
const Image = mongoose.model("Image",imageSchema);
module.exports = Image;