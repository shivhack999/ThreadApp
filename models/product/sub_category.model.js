const { default: mongoose } = require("mongoose");

const subCategorySchema = mongoose.Schema({
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
    sub_category_name:{
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
    }
})

const subCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = subCategory;