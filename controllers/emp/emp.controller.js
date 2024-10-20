const {validationResult} = require('express-validator');
const login =  async(req,res) =>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(500).json({
                success:false,
                errors:errors.array()
            })
        }
        const {email, password} = req.body;

        const userData = await Users.findOne({email}).exec();
        // console.log(userData)
        if(!userData){
            return res.status(400).json({
                success:false,
                response:"Email id not register?" 
            });
        }
        const passwordMatch = await bcrypt.compare(password, userData.password);
        if (!passwordMatch) {
            return res.status(400).json({ 
                success:false,
                response: 'Email id and password is Incorrect!'
            });
        }
        if(userData.active === false){
            return res.status(400).json({ 
                success:false,
                response: 'Your account is temporary blocked please connect with customer care.'
            });
        }
        const accessToken = await generateAccessToken({userData:userData});
        const refreshToken = await generateRefreshToken({userData:userData._id});
        await Users.findByIdAndUpdate(
            userData._id,
            {$set:{refreshToken:refreshToken}},
            {new:true}
        ) 
        const responseUserData = await Users.findById(userData._id).select("-password -create_At -refreshToken -__v");
        const option ={
            httpOnly:true,
            secure:true,
            sameSite:'strict'
        }
        return res.status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json({
            success:true,
            response:"User Login Successfully",
            userData:responseUserData,
            tokenType: 'Bearer',
            refreshToken:refreshToken
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error
        })
    }
}

module.exports = {
    login
}