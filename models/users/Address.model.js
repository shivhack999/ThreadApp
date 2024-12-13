const mongoose = require('mongoose')
 
const addressSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    fullName:{
        type:String,
        required:true
    },
    addressType:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        maxLength:10,
        minLength:10,
        required:true,
    },
    alternative:{
        type:Number,
        maxLength:10,
        minLength:10,
    },
    houseNo:{
        type:String,
        required:true
    },
    colonyName:{
        type:String,
        required:true
    },
    landmark:{
        type:String,
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    pincode:{
        type:Number,
        maxLength:6,
        minLength:6,
        required:true
    },
    create_At:{
        type:Date,
        default:Date.now
    },
    updated_At:{
        type:Date
    },
    updated_By:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    }
});

const Address = mongoose.model('Address',addressSchema);

module.exports = Address;