const mongoose = require('mongoose')
 
const addressSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    fullName:{
        type:String,
        required:true
    },
    addressType:{
        type:String,
        enum:['Home','Work','Office'],
        required:true
    },
    phone:{
        type:[Number],
        required:true,
    },
    // house no , colony/area/ , landmark, city, state, pin code 
    house_No_Or_building_No:{
        type:String,
        required:true
    },
    area:{
        type:String,
        required:true
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
        required:true
    },
    create_At:{
        type:Date,
        default:Date.now
    }
});

const Address = mongoose.model('Address',addressSchema);

module.exports = Address;