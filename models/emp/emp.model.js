const mongoose = require("mongoose");
const employeeSchema = mongoose.Schema({
    name:{
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
    joiningDate:{
        type:Date,
        required:true
    },
    departmentID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Department',
        required:true
    },
    roleId:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true,
        minlength: 5,
        maxlength: 1024
    },
    refreshToken:{
        type:String
    },
    create_At:{
        type:Date,
        default: Date.now()
    },
    active:{
        type:Boolean,
        default:true
    }
});
const user = mongoose.model("Users", employeeSchema);
module.exports = user;