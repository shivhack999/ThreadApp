const bcrypt = require("bcrypt");
const generatePassword = async(password)=>{
    return await bcrypt.hash(password, 10);
}
module.exports = generatePassword;