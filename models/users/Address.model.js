const express = require('express')
const mongoose = require('mongoose')
 
const addressSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    full_name:{
        type:String,
        required:true
    },
    phone_number:{
        type:[Number],
        required:true,
    },
    pin_code:{
        type:Number,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    house_No_Or_building_No:{
        type:String,
        required:true
    },
    area:{
        type:String,
        required:true
    },
    create_At:{
        type:Date,
        default:Date.now()
    }

});

const Address = mongoose.model('Address',addressSchema);

module.exports = Address;