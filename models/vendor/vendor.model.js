const mongoose = require("mongoose");

const vendorSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    contact:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    location:{
        type:String
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
    }
});

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;