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
    available:{
        type:Boolean,
        default:true
    },
    images:{
        type:String
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
    searchCount:{
        type:Number,
        default:1
    }
});

const subSubCategory = mongoose.model("SubSubCategory", subSubCategorySchema);

module.exports = subSubCategory;