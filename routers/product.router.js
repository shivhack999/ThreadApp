const express = require("express");
const router = express.Router();
const dynamicUploads =  require('../middleware/upload.middleware')
const productController = require('../controllers/products/product.controller');
const {productAdd} = require('../helpers/products/product.validation');

router.post("/addProduct", productAdd, dynamicUploads("/products/t-shirt"), productController.addProduct);
router.get("/productDetails", productController.productDetails);
router.get("/showProduct", productController.showProduct);
module.exports = router;
