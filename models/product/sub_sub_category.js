const { default: mongoose } = require("mongoose");

const subSubCategorySchema = mongoose.Schema({
    subCategoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'SubCategory',
        required:true
    },
    sub_sub_category_name:{
        type:String,
        required:true
    },
    images:{
        type:String
    },
    create_At:{
        type:Date,
        default:Date.now
    },
    updated_At:{
        type:Date,
        default:Date.now
    }
})

const subSubCategory = mongoose.model("SubSubCategory", subSubCategorySchema);

module.exports = subSubCategory;