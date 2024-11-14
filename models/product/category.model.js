const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    category_name:{
        type:String,
        required:true
    },
    images:{
        type:String,
        required:true
    },
    create_At:{
        type:Date,
        default:Date.now
    }
})

const category = mongoose.model("Category", categorySchema);

module.exports = category;