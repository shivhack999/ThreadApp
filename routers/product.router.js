const express = require("express");
const router = express.Router();
const dynamicUpload = require('../middleware/upload.middleware');
const multipleUpload = require('../middleware/multipleUpload.middleware');
const productController = require('../controllers/products/product.controller');
const {productAdd} = require('../helpers/products/product.validation');
const empTokenVerify = require("../middleware/emp/emp.middleware");
const deviceIdentify = require("../middleware/security/identifyDevice");
// const upload = require('../middleware/upload.middleware');
const multer = require("multer");
const imageFields = [
  { name: 'webImages', maxCount: 5 }, // Accept up to 5 web images
  { name: 'appImages', maxCount: 5 }, // Accept up to 5 app images
  { name: 'colorImage', maxCount: 1} 
];
// dynamicUpload("/products/t-shirt")
router.post("/addProduct", deviceIdentify, empTokenVerify, productAdd, productController.addProduct);
router.get("/productDetails", deviceIdentify, productController.productDetails);
router.get("/showProduct", deviceIdentify, productController.showProduct);
router.get("/showProductTitle", deviceIdentify, productController.showProductTitle);
router.post("/addCategory", deviceIdentify, dynamicUpload("/products/category"), productController.addCategory);
router.get("/showCategory", deviceIdentify, productController.showCategory);
router.post("/addSubCategory", deviceIdentify, dynamicUpload("/products/sub_category"), productController.addSubCategory);
router.get("/showSubCategory", deviceIdentify, productController.showSubCategory);
router.post("/addSubSubCategory", deviceIdentify, dynamicUpload("products/sub_sub_category"), productController.addSubSubCategory); //remove space in image name 
router.get("/showSubSubCategory", deviceIdentify, productController.showSubSubCategory);
router.put("/incrementSubSubProductSearchCount/:id", deviceIdentify, productController.incrementSubSubProductSearchCount);
router.post("/addVariant", deviceIdentify, empTokenVerify, multipleUpload("/products/variant",imageFields), productController.addVariant);
router.get("/showAllColorOfProduct", deviceIdentify, productController.showAllColorOfProduct);
router.get("/showAllColorOfVariant", deviceIdentify, productController.showAllColorOfVariant);
router.get("/showAllFilters", deviceIdentify, productController.showAllFilters);
router.post("/addBrand", empTokenVerify, productController.addBrand);
router.get("/showBrand", productController.showBrand); 
router.get("/showAllVariant", deviceIdentify, productController.showAllVariant);
// router.post("/test", multipleUpload("/products/variant",imageFields), productController.test);








// // Configure multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Save files in the 'uploads' directory
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname); // Rename file to prevent conflicts
//   },
// });

// // Multer middleware for handling file uploads
// const upload = multer({ storage });

// router.post("/addVariant", upload.single("colorImage"), productController.addVariant);




module.exports = router;
