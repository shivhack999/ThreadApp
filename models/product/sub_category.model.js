const { default: mongoose } = require("mongoose");

const subCategorySchema = new mongoose.Schema({
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
    name:{
        type:String,
        required:true
    },
    images:{
        type:String,
        required:true
    },
    available:{
        type:Boolean,
        required:true,
        default:true
    },
    create_At:{
        type:Date,
        default:Date.now
    },
    updated_At:{
        type:Date
    },
    count:{
        type:Number,
        default:1
    }
})

const subCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = subCategory;