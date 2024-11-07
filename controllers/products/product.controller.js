const Product = require('../../models/product/product.model');
const addProduct = async(req,res) =>{
    const {
        product_name,
        quantity,
        category,
        sub_category,
        sub_sub_category,
        brand,
        color,
        material,
        targetAudience,
        buy_price,
        sale_price,
        max_price,
        min_price,
        discount,
        description,
        keywords,
      } = req.body;
  
      // Check for uploaded images and save their paths
      const images = req.files ? req.files.map(file => file.path) : [];

      try {
        // Create a new Product instance
        const newProduct = new Product({
          product_name,
          quantity,
          category,
          sub_category,
          sub_sub_category,
          brand,
          color,
          material,
          targetAudience,
          buy_price,
          sale_price,
          max_price,
          min_price,
          discount,
          description,
          images,
          keywords
        });
  
        // Save product to the database
        await newProduct.save();
  
        res.status(201).json({ message: 'Product added successfully', product: newProduct })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error
        })
    }
}
const showProduct = async(req,res)=>{
    
    const {product_name,category,sub_category,sub_sub_category,brand,min_price,max_price,color,material,targetAudience,discount,keywords} = req.query;
    let filter = {};
    if (product_name) filter.product_name = new RegExp(product_name, 'i');
    if (category) filter.category = { $in: category.split(',').map(value => new RegExp(`^${value}$`, 'i')) };
    if (sub_category) filter.sub_category = { $in: sub_category.split(',').map(value => new RegExp(`^${value}$`, 'i')) };
    if (sub_sub_category) filter.sub_sub_category = { $in: sub_sub_category.split(',').map(value => new RegExp(`^${value}$`, 'i')) };
    if (brand) filter.brand = { $in: brand.split(',').map(value => new RegExp(`^${value}$`, 'i')) };
    if (color) filter.color = { $in: color.split(',').map(value => new RegExp(`^${value}$`, 'i')) };
    if (material) filter.material = { $in: material.split(',').map(value => new RegExp(`^${value}$`, 'i')) };
    if (targetAudience) filter.targetAudience = { $in: targetAudience.split(',').map(value => new RegExp(`^${value}$`, 'i')) };
    if (keywords) filter.keywords = { $in: keywords.split(',').map(value => new RegExp(`^${value}$`, 'i')) };

    // Filter by discount range, if specified
    if (discount) filter.discount = { $gte: parseFloat(discount) };

    // Filter by price range if specified
    if (min_price || max_price) {
      filter.sale_price = {};
      if (min_price) filter.sale_price.$gte = parseFloat(min_price);
      if (max_price) filter.sale_price.$lte = parseFloat(max_price);
    }

    try {
        // Fetch products based on filter
    const products = await Product.find(filter);

    // Map through products to include the image URL
    const productsWithImagePath = products.map(product => ({
      ...product.toObject(),
      images: product.images.map(imgPath => `${req.protocol}://${req.get("host")}/uploads/products/t-shirt/${imgPath}`),

    }));

    res.status(200).json({ message: 'Products fetched successfully', products: productsWithImagePath });
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error
        })
    }
}
const productDetails = async(req,res) =>{
    try {

        const ProductId = req.query['productId'];
        const productData = await Product.findById(ProductId);
        return res.status(200).json({
            success:true,
            product: productData ? productData : 'product not found'
        });

    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error
        })
    }
}



module.exports = {
    addProduct,
    showProduct,
    productDetails,
}