const mongoose = require("mongoose");
const roleSchema = mongoose.Schema({
    name:{
        type:String,
        req
    }
});
const role = mongoose.model("Roles", roleSchema);
module.exports = role;


