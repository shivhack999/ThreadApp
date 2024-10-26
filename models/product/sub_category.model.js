const { default: mongoose } = require("mongoose");

const subCategorySchema = mongoose.Schema({
    categoryID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
    sub_category_name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    create_At:{
        type:Date,
        default:Date.now()
    }
})

const subCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = subCategory;