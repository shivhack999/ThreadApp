const express = require("express");
const router = express.Router();
const dynamicUploads =  require('../middleware/upload.middleware')
const productController = require('../controllers/products/product.controller');

router.post("/addProduct", dynamicUploads("/products/t-shirt"), productController.addProduct); 
router.get("/showProduct", productController.showProduct);
module.exports = router;
