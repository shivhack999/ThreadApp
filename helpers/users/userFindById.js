const User = require("../../models/users/user.model");

const userFindById = async(id,select) =>{
    try {
        const userData = await User.findById(id).select(select).exec();
        return userData;
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = userFindById;