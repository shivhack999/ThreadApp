const Users = require("../../models/users/user.model");

const userFindOne = async(fieldName, fieldValue, select) =>{
    try {
        console.log(fieldName, fieldValue, )
        const userData = await Users.findOne({fieldName:fieldValue}).select(select);
        console.log(userData);
    } catch (error) {
        console.log(error);
        return false;
    }
}
module.exports = userFindOne;