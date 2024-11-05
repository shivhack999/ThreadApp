const Cart = require('../../models/users/Cart.model');
const addToCart = async(req,res) =>{
    try {
        const userID = req.userID;
        const {product} = req.body;
        const newData = new Cart({
            user:userID,
            product
        });
        await newData.save();
        return res.status(200).json({
            success:true,
            response:'successfully product add in cart'
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:'Please try again.'
        })
    }
}

const removeToCart = async(req,res)=>{
    try {
        const userID = req.userID;
        const productId = req.query['productId'];
        if(!productId){
            return res.status(400).json({
                success:false,
                response:' Choose valid Items!'
            }) 
        }
        const removeProduct = await Cart.findOneAndDelete({user:userID , product:productId});
        if(!removeProduct){
            return res.status(400).json({
                success:false,
                response:' something is wrong please try again'
            })   
        }
        return res.status(200).json({
            success:true,
            response:'Successfully item delete in Cart.'
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:'Please try again.'
        })
    }
}
module.exports = {
    addToCart,                                      
    removeToCart
}