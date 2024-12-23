const {check} = require('express-validator');
exports.userEmailSent = [
    // check("email","Enter the Email ID").not().isEmpty(),
    check("email", "Enter the valid Email ID").isEmail().not().isEmpty()
]
exports.emailOTPVerify = [
    check("email", "Enter the valid Email ID").isEmail()
]
exports.userLogin = [
    check('email','Enter the valid email Id').isEmail(),
    check('password','Password must be greater then 8 Characters, and Contains one capital letter, one spacial symbol, one small letter and numbers')
    .isStrongPassword({
        minLength:8,
        minLowercase:1,
        minUppercase:1,
        minSymbols:1,
        minNumbers:1
    }),
]
exports.userRegister = [
    check('fullName', 'Name is required').not().isEmpty(),
    check('mobile','Mobile No. should be contains only 10 digits').isLength({
        min:10,
        max:10
    }),
    check('email','Enter the valid email Id').isEmail(),
    check('gender', 'Gender is required').not().isEmpty(),
    check('password','Password must be greater then 8 Characters, and Contains one capital letter, one spacial symbol, one small letter and numbers')
    .isStrongPassword({
        minLength:8,
        minLowercase:1,
        minUppercase:1,
        minSymbols:1,
        minNumbers:1
    }),
]

exports.userResetPassword = [
    check('oldPassword','Password must be greater then 8 Characters.').not().isEmpty(),
    check('newPassword','Password must be greater then 8 Characters, and Contains one capital letter, one spacial symbol, one small letter and numbers')
    .isStrongPassword({
        minLength:8,
        minLowercase:1,
        minUppercase:1,
        minSymbols:1,
        minNumbers:1
    }),
]