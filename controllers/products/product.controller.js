const Product = require('../../models/product/product.model');
const Category = require('../../models/product/category.model');
const SubCategory = require('../../models/product/sub_category.model');
const subCategory = require('../../models/product/sub_category.model');
const SubSubCategory = require('../../models/product/sub_sub_category');
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

const addCategory = async(req,res) =>{
    try {
        const { category_name, images } = req.body;
        console.log(req.body)

    if (!category_name || !images) {
        return res.status(400).json({ error: 'Both category_name and image are required' });
    }
    const category = new Category({
        category_name,
        images
    });

    // Save the category to the database
    const categoryResponse = await category.save();
    if(categoryResponse){
        res.status(201).json({success:true, response: 'Category created successfully', category });
    }
    res.status(400).json({ success:false,response:"Something is missing please connect with developer."})
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success:false,
            response:error
        })
    }
}
const showCategory = async(req,res) =>{
    try {
        const root = `${req.protocol}://${req.get('host')}/uploads`;
        const categories = await Category.find().exec();
        const categoriesWithFullImagePath = categories?.map(category => ({
            ...category._doc,
            images: `${root}${category.images}`,
        }));
        res.status(200).json({
            success:true,
            categories:(categoriesWithFullImagePath)? categoriesWithFullImagePath : null
        });

    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error
        })
    }
}
const addSubCategory = async(req,res) =>{
    try {
        const {categoryId,sub_category_name,images} = req.body;

        const new_sub_category = new SubCategory({
            categoryId,sub_category_name,images
        });
        let sub_category_response = await new_sub_category.save();
        if(sub_category_response){
            return res.status(200).json({
                success:true,
                response:'Sub Category created successfully',
                response:sub_category_response
            })
        }
        return res.status(400).json({
            success:false,
            response:"Something is wrong please connect with develop team."
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error
        })
    }
}

const showSubCategory = async(req,res) =>{
    try {
        const root = `${req.protocol}://${req.get('host')}/uploads`;
        const sub_categories = await SubCategory.find().select("-__v -create_At").exec();
        res.status(200).json({
            success:true,
            root:root,
            response:(sub_categories)? sub_categories : null
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error
        })
    }
}

const addSubSubCategory = async(req,res)=>{
    try {
        const {subCategoryId,sub_sub_category_name, images} = req.body;
        const newSSC = new SubSubCategory({
            subCategoryId,sub_sub_category_name, images
        });
        const newSSCresponse = await newSSC.save();
        if(newSSCresponse){
            return res.status(200).json({
                success:true,
                response:newSSC
            })
        }
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error
        })
    }
}
const showSubSubCategory = async(req,res) =>{
    try {
        const listOfSSC = await SubSubCategory.find().exec();
        let status = (listOfSSC) ? 200 :400;
        const root = `${req.protocol}://${req.get('host')}/uploads`;
        return res.status(status).json({
            success:(status == 200) ? true :false,
            root:root,
            response: (listOfSSC) ? listOfSSC : 'No Data found.'
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error
        })
    }
}
const incrementSubSubProductSearchCount = async(req,res) =>{
    try {
        const { id } = req.params;
        const updatedSubSubCategory = await SubSubCategory.findByIdAndUpdate(
            id,
            { $inc: { searchCount: 1 }, updated_At: Date.now() },
            { new: true } // Return the updated document
        );
        if (!updatedSubSubCategory) {
            return res.status(404).json({ success:false, response: 'SubSubCategory not found' });
        }
        res.status(200).json({
            success:true,
            response: 'Search count incremented successfully',
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:'Something is missing please try again!'
        })
    }
}
module.exports = {
    addProduct,
    showProduct,
    productDetails,
    addCategory,
    showCategory,
    addSubCategory,
    showSubCategory,
    addSubSubCategory,
    showSubSubCategory,
    incrementSubSubProductSearchCount
    
}