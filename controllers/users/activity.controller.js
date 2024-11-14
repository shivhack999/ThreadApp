const Cart = require('../../models/users/Cart.model');
const Order = require('../../models/users/order.model');
const Product = require('../../models/product/product.model');
const OrderCancelStatus = require('../../models/users/orderCancelStatus.model');
const { default: mongoose } = require('mongoose');
const capitalize = require('../../helpers/capitalize');
const addToCart = async(req,res) =>{
    try {
        const userID = req.userID;
        const {product, sell_price} = req.body;
        const productData = await Product.findById(product).select("min_price -_id").exec();
        // compare selling price with product minimum selling  price if product minimum selling price is low of selling price then not allow  
        if(productData.min_price > sell_price){
            return res.status(400).json({
                success:false,
                response:`Any seller can't sell product on  ${ sell_price} price.`
            })
        }
        const newData = new Cart({
            user:userID,
            product,
            sell_price: Math.ceil(sell_price)
        });
        const newCartResponse = await newData.save();
        if(newCartResponse){
            return res.status(200).json({
                success:true,
                response:'successfully Product add in cart'
            })
        }
        return res.status(400).json({
            success:false,
            response:"Something is wrong please try again."
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
                response:'Select Product.'
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
const productOrder = async(req,res) =>{
    try {
        const userId = req.userID;
        console.log(userId)
        const {products, addressId, payment_mode} = req.body;
        const capitalize_payment_mode = await capitalize(payment_mode);
        
        // Collect all product ID's that will be checked for quantity
        const productIds = products.map(product => product.productId);

        // Fetch all the products and their quantities in a single call
        const responseProducts = await Product.find({ '_id': { $in: productIds } }).select('quantity _id');

        // Create a map of product ID to available quantity for easy lookup
        const productQuantityMap = responseProducts.reduce((acc, product) => {
            acc[product._id.toString()] = product.quantity;
            return acc;
        }, {});

        // Check if the requested quantity is available for each product
        for (const product of products) {
        const availableQuantity = productQuantityMap[product.productId.toString()];

            if (!availableQuantity || availableQuantity < product.quantity) {
                return res.status(400).json({
                success: false,
                response: `You can order only ${availableQuantity} pieces of ${product.productId} that time.`
                });
            }
        }
        const current_time = Date.now;
        console.log("vjh",capitalize_payment_mode)
        if(capitalize_payment_mode == "Online"){
            // get user name and mobile for transaction
            
            const userData = await findById(userId);
            console.log("lkkjg",userData);
            
            
            //add payment mechanism
            const MUId = MUId + current_time;
            const transactionId = userId +'T' + current_time;
            const name = userData.fullName;
            const mobile = userData.mobile;
        }
        
        // const newOrder = new Order ({
        //     userId,
        //     productId:products,
        //     addressId,
        //     payment_Status:,
        //     payment_mode:,
        //     transactionId,
        //     create_At:current_time
        // })
        // const orderResponse = await newOrder.save();
        // if(orderResponse){
        //     return res.status(200).json({
        //         success:true,
        //         response:"Product Order successfully.",
        //         orderDetails:orderResponse
        //     })
        // }
        // return res.status(400).json({
        //     success:false,
        //     response:'Something is missing please try again.'
        // })
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error
        })
    }
}
const orderCancel = async(req,res) =>{
    try {
        const userId = req.userID;
        const orderId = req.query['orderId'] || req.body.orderId || req.params['orderId'];
        const delivery_status = 'cancelled';

        // session start 
        const session = await mongoose.startSession();
        session.startTransaction();

        // Fetch the Order and Product documents
        const orderData = await Order.findById(orderId).session(session);
        if(!orderData){
            await session.abortTransaction();
            return res.status(200).json({
                success:false,
                response:'Order not found.'
            })
        }
        // work here
        if(delivery_status != orderData.delivery_status){
            orderData.delivery_status = delivery_status;
            await orderData.save({ session });
            const newOrderCancel = new OrderCancelStatus({
                orderId,
                userId,
                quantity:orderData.quantity,
                status:'Pending'

            })


            productData.quantity = productData.quantity + quantity ;
            await productData.save({ session });
            await session.commitTransaction();
            return res.status(200).json({
                success:true,
                response:' Your order successfully cancel.'
            })
        }
        session.endSession();
        return res.status(400).json({
            success:false,
            response:'Your Order already cancelled.'
        })
    } catch (error) {
        return res(400).json({
            success:false,
            response:error
        })
    }
}
module.exports = {
    addToCart,                                      
    removeToCart,
    productOrder, // modify because some change in schema
    orderCancel

}