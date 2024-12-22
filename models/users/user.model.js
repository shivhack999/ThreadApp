const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    fullName:{
        type:String,
        required:true,
        minlength: 3,
        maxlength: 50
    },
    mobile:{
        type:Number,
        required:true,
        unique:true,
        minlength: 10,
        maxlength: 10
    },
    email:{
        type:String,
        minlength: 5,
        maxlength: 255
    },
    gender:{
        type:String,
        required:true,
        minlength: 4,
        maxlength: 6
    },
    password:{
        type:String,
        required:true,
        minlength: 5,
        maxlength: 1024
    },
    e_verify:{
        type:Boolean,
        default:false
    },
    m_verify:{
        type:Boolean,
        default:false
    },
    image:{
        type:String
    },
    refreshToken:{
        type:String
    },
    create_At:{
        type:Date,
        default: Date.now()
    },
    updated_At:{
        type:Date
    },
    updated_By:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Employee'
    },
    active:{
        type:Boolean,
        default:true
    }
});
const user = mongoose.model("Users", userSchema);
module.exports = user;