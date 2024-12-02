const mongoose = require('mongoose')
 
const addressSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    fullName:{
        type:String,
        required:true
    },
    address_type:{
        type:String,
        enum:['Home','Work','Office'],
        required:true
    },
    phone_number:{
        type:Number,
        maxLength:10,
        minLength:10,
        required:true,
    },
    alternative_number:{
        type:Number,
        maxLength:10,
        minLength:10,
    },
    // house no , colony/area/ , landmark, city, state, pin code 
    // alternative number
    house_No_Or_building_No:{
        type:String,
        required:true
    },
    area_Or_colony:{
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
    pin_code:{
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
    }
});

const Address = mongoose.model('Address',addressSchema);

module.exports = Address;