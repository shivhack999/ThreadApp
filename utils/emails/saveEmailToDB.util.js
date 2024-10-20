const Users = require('../../models/users/user.model');
const saveEmail = async(id,email) =>{
    // console.log(id,email);
    await Users.findByIdAndUpdate(
        id,
        { email: email, e_verify : true},
        { new: true, runValidators: true }
    );
    // console.log(newUser);
}

module.exports = saveEmail;