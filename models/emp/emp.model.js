const mongoose = require("mongoose");
const empSchema = mongoose.Schema({
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
        unique:true,
        maxlength: 255
    },
    gender:{
        type:String,
        required:true,
        minlength: 4,
        maxlength: 6
    },
    hire_date:{
        type:Date,
        required:true
    },
    department:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Department',
        required:true
    },
    roles:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Role'
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
const Employee = mongoose.model("Employee", empSchema);
module.exports = Employee;