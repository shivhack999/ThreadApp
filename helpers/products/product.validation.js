const {check} = require('express-validator');

exports.productAdd =[
    check("title","Product title is required.").not().isEmpty(),
    check("vendor", 'Vendor name is required.').not().isNumeric(),
    check("product_type","Product Type name is required.").not().isEmpty(),
    check("published_At", "Enter the valid date for published product.").not().isDate(),
    check("targetAudience", "choose target audience.").not().isArray(),
    check("brand","Brand name is required.").not().isEmpty(),
    check("tags", "write tags according to product").not().isEmpty(),
    // check("color", "Product color is required.").not().isEmpty().isArray(),
    // check("material", "Product material is required.").not().isEmpty().isArray(),
    // check("targetAudience", "select Audience types.").not().isEmpty().isArray(),
    // check("buy_price", " Enter the valid product Buy price").not().isNumeric(),
    // check("sale_price", " Enter the valid product sale price").not().isNumeric(),
    // check("max_price", " Enter the valid product max selling  price").not().isNumeric(),
    // check("min_price", " Enter the valid product min selling price").not().isNumeric(),
    // check("description", "Enter the product description").not().isEmpty(),

]