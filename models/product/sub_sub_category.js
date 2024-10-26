const { default: mongoose } = require("mongoose");

const subSubCategorySchema = mongoose.Schema({
    subCategoryID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'SubCategory',
        required:true
    },
    sub_sub_category_name:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    create_At:{
        type:Date,
        default:Date.now()
    }
})

const subSubCategory = mongoose.model("SubSubCategory", subSubCategorySchema);

module.exports = subSubCategory;