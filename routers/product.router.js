const express = require("express");
const router = express.Router();
const dynamicUpload =  require('../middleware/upload.middleware')
const productController = require('../controllers/products/product.controller');
const {productAdd} = require('../helpers/products/product.validation');


router.post("/addProduct", productAdd, dynamicUpload("/products/t-shirt"), productController.addProduct);
router.get("/productDetails", productController.productDetails);
router.get("/showProduct", productController.showProduct);
router.post("/addCategory", dynamicUpload("/products/category"), productController.addCategory);
router.get("/showCategory", productController.showCategory);
router.post("/addSubCategory", dynamicUpload("/products/sub_category"), productController.addSubCategory);
router.get("/showSubCategory", productController.showSubCategory);
router.post("/addSubSubCategory", dynamicUpload("products/sub_sub_category"), productController.addSubSubCategory); //remove space in image name 
router.get("/showSubSubCategory", productController.showSubSubCategory);
router.put("/incrementSubSubProductSearchCount/:id", productController.incrementSubSubProductSearchCount);
module.exports = router;

