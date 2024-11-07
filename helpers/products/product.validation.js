const {check} = require('express-validator');

exports.productAdd =[
    check("product_name","Product name is required.").not().isEmpty(),
    check("quantity", 'Quantity is required.').not().isNumeric(),
    check("category","Category name is required.").not().isEmpty(),
    check("sub_category", "Sub category is required.").not().isEmpty(),
    check("brand","Brand name is required.").not().isEmpty(),
    check("color", "Product color is required.").not().isEmpty().isArray(),
    check("material", "Product material is required.").not().isEmpty().isArray(),
    check("targetAudience", "select Audience types.").not().isEmpty().isArray(),
    check("buy_price", " Enter the valid product Buy price").not().isNumeric(),
    check("sale_price", " Enter the valid product sale price").not().isNumeric(),
    check("max_price", " Enter the valid product max selling  price").not().isNumeric(),
    check("min_price", " Enter the valid product min selling price").not().isNumeric(),
    check("description", "Enter the product description").not().isEmpty(),

]