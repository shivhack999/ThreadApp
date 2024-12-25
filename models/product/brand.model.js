const mongoose = require('mongoose');

const brandSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    create_At:{
        type:Date,
        default:Date.now
    },
    updated_At:{
        type:Date,
        default:Date.now
    },
    created_By:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Employee"
    },
    updated_By:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employee"
    }
})

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;