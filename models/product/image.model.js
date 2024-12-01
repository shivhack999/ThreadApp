const mongoose = require("mongoose")

const imageSchema = mongoose.Schema({
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
    url:{
        type:String,
        required:true
    },
    position:{
        type:Number,
        required:true
    },
    created_By:{ // hold ID of employee which is add product 
        type:mongoose.Schema.Types.ObjectId,
        ref:'Employee',
        required:true
    },
    updated_By:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Employee'
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