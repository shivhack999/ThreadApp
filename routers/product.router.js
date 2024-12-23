const express = require("express");
const router = express.Router();
const dynamicUpload =  require('../middleware/upload.middleware')
const productController = require('../controllers/products/product.controller');
const {productAdd} = require('../helpers/products/product.validation');
const empTokenVerify = require("../middleware/emp/emp.middleware");
const deviceIdentify = require("../middleware/security/identifyDevice");

// dynamicUpload("/products/t-shirt")
router.post("/addProduct", deviceIdentify, empTokenVerify, productAdd, productController.addProduct);
router.get("/productDetails", deviceIdentify, productController.productDetails);
router.get("/showProduct", deviceIdentify, productController.showProduct);
router.post("/addCategory", deviceIdentify, dynamicUpload("/products/category"), productController.addCategory);
router.get("/showCategory", deviceIdentify, productController.showCategory);
router.post("/addSubCategory", deviceIdentify, dynamicUpload("/products/sub_category"), productController.addSubCategory);
router.get("/showSubCategory", deviceIdentify, productController.showSubCategory);
router.post("/addSubSubCategory", deviceIdentify, dynamicUpload("products/sub_sub_category"), productController.addSubSubCategory); //remove space in image name 
router.get("/showSubSubCategory", deviceIdentify, productController.showSubSubCategory);
router.put("/incrementSubSubProductSearchCount/:id", deviceIdentify, productController.incrementSubSubProductSearchCount);
router.post("/addImages", deviceIdentify, empTokenVerify, dynamicUpload("/products/t-shirt"), productController.addImages);
router.post("/addVariant", deviceIdentify, empTokenVerify, productController.addVariant);
router.get("/showAllColorOfProduct", deviceIdentify, productController.showAllColorOfProduct);
router.get("/showAllColorOfVariant", deviceIdentify, productController.showAllColorOfVariant);
router.get("/showAllFilters", deviceIdentify, productController.showAllFilters);
module.exports = router;
