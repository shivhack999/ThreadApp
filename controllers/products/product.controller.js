const Product = require('../../models/product/product.model');
const Category = require('../../models/product/category.model');
const SubCategory = require('../../models/product/sub_category.model');
const SubSubCategory = require('../../models/product/sub_sub_category');
const Variant = require('../../models/product/variant.model');
const Image = require('../../models/product/image.model');
const insertMany = require('../../utils/query/insertMany');
const find = require('../../utils/query/find');
const Brand = require("../../models/product/brand.model");

const addProduct = async(req,res) =>{
    const {
        title,
        vendorId,
        product_type,
        published_At,
        targetAudience,
        brand,
        tags,
      } = req.body;
  
      // Check for uploaded images and save their paths
    //   const images = req.files ? req.files.map(file => file.path) : [];
      try {
        // Create a new Product instance
        const newProduct = new Product({
          title,
          vendorId,
          product_type,
          published_At,
          targetAudience,
          brand,
          tags,
          created_By:req.empId,
          created_At:Date.now(),

        });
        // Save product to the database
        const savedProduct = await newProduct.save();
        if(savedProduct){
            res.status(201).json({ 
                success:true,
                message: 'Product added successfully', 
                product: savedProduct 
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success:false,
            message:'Internal server error'
        })
    }
}
const showProduct = async(req,res)=>{
    const device = req.device;
    console.log(device)
    const { page = 1, limit = 10, sortBy = "created_At", order = "desc", title, brand, product_type, published_At, targetAudience, tags } = req.query;
    try {
        const pipeline = [];
        // Filtering by query parameters
        if (title) {
            pipeline.push({
                $match: { title: { $regex: title, $options: "i" } } // Case-insensitive search for title
            });
        }
        if (brand) {
            pipeline.push({
                $match: { brand } // Filter by brand
            });
        }

        if (targetAudience) {
            pipeline.push({
                $match: { targetAudience } // Filter by target audience
            });
        }
        pipeline.push({
            $sort: { [sortBy]: order === "asc" ? 1 : -1 }
        });
        const skip = (parseInt(page) - 1) * parseInt(limit);
        pipeline.push({ $skip: skip }, { $limit: parseInt(limit) });

        pipeline.push({
            $lookup: {
                from: "variants", // Actual collection name in your database
                localField: "_id",
                foreignField: "productId",
                as: "Variants"
            }
        });

        // Lookup Images for each Variant
        pipeline.push({
            $lookup: {
                from: "images", // Actual collection name in your database
                localField: "Variants._id",
                foreignField: "variantId",
                as: "Images"
            }
        });

        // Structuring the Data
        pipeline.push({
            $addFields: {
                Variants: {
                    $map: {
                        input: "$Variants",
                        as: "variant",
                        in: {
                            _id: "$$variant._id",
                            title: "$$variant.title",
                            serial_number: "$$variant.serial_number",
                            quantity:"$$variant.quantity",
                            color:"$$variant.color",
                            material:"$$variant.material",
                            sale_price:"$$variant.sale_price",
                            discount:"$$variant.discount",
                            size:"$$variant.size",
                            barcode:"$$variant.taxable",
                            quantity_rule:"$$variant.quantity_rule",
                            price_currency:"$$variant.price_currency",
                            images: {
                                $filter: {
                                    input: "$Images",
                                    as: "image",
                                    cond: { $eq: ["$$image.variantId", "$$variant._id"] }
                                }
                            }
                        }
                    }
                }
            }
        });

        // // Exclude Unnecessary Fields
        // pipeline.push({
        //     $project: {
        //         __v: 0,
        //         vendor: 0,
        //         created_By: 0,
        //         created_At: 0,
        //         updated_By: 0,
        //         updated_At: 0,
        //         Images: 0 // Since images are already nested under Variants
        //     }
        // });

        // pipeline.push({
        //     $project:{
        //         __v:0,
        //         vendor:0,
        //         created_By:0,
        //         create_At:0,
        //         updated_By:0,
        //         created_by:0,
        //         Variant :{
        //             buy_price:0,
        //             __v:0,
        //             created_By:0,
        //             created_At:0,
        //             updated_By:0,
        //             updated_At:0,
        //             quantity_rule:{
        //                 _id:0
        //             }
        //         }
        //     }
        // })
        const products = await Product.aggregate(pipeline);
        const root = `${req.protocol}://${req.get('host')}/uploads`;
        res.status(200).json({
            success: true,
            root,
            products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                count: products.length,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Internal server error'
        })
    }
}
const showProductTitle = async(req,res) =>{
    try {
        await find(Product,"title").then((response)=>{
            return res.status(200).json({
                success:true,
                data:response
            })
        });

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Internal server error'
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
        return res.status(500).json({
            success:false,
            message:'Internal server error'
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
        images:images[0]
    });

    // Save the category to the database
    const categoryResponse = await category.save();
    if(categoryResponse){
        res.status(201).json({success:true, response: 'Category created successfully', category });
    }
    res.status(400).json({ success:false,response:"Something is missing please connect with developer."})
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:'Internal server error'
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
        return res.status(500).json({
            success:false,
            message:'Internal server error'
        })
    }
}
const addSubCategory = async(req,res) =>{
    try {
        const {categoryId,sub_category_name,images} = req.body;

        const new_sub_category = new SubCategory({
            categoryId,sub_category_name,images:images[0]
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
        return res.status(500).json({
            success:false,
            message:'Internal server error'
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
        return res.status(500).json({
            success:false,
            message:'Internal server error'
        })
    }
}
const addSubSubCategory = async(req,res)=>{
    try {
        const {subCategoryId,sub_sub_category_name, images} = req.body;
        const newSSC = new SubSubCategory({
            subCategoryId,sub_sub_category_name, images:images[0]
        });
        const newSSCresponse = await newSSC.save();
        if(newSSCresponse){
            return res.status(200).json({
                success:true,
                response:newSSC
            })
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Internal server error'
        })
    }
}
const showSubSubCategory = async(req,res) =>{
    try {
        const select = "name images";
        const listOfSSC = await find(SubSubCategory,select);
        let status = (listOfSSC) ? 200 :400;
        const root = `${req.protocol}://${req.get('host')}/uploads`;
        return res.status(status).json({
            success:(status == 200) ? true :false,
            root:root,
            data: (listOfSSC) ? listOfSSC : 'No Data found.'
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Internal server error'
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
        return res.status(500).json({
            success:false,
            message:'Internal server error'
        })
    }
}
const addVariant = async(req,res) =>{
    console.log("Request Body:", req.body); // Logs other form fields
    console.log("Uploaded File:", req.files); // Logs file metadata if the upload works
    try {
        const empId = req.empId;
        const {
            productId,
            title,
            quantity,
            color,
            material,
            buy_price,
            sale_price,
            max_price,
            min_price,
            discount,
            description,
            barcode,
            taxable,
            min,
            increment
        } = req.body;
        const newVariant = new Variant({
            productId,
            title,
            quantity,
            color,
            colorImage:colorImage[0]?.filename,
            material,
            buy_price,
            sale_price,
            max_price,
            min_price,
            discount,
            description,
            barcode,
            taxable,
            quantity_rule:{min,increment},
            // quantity_rule,
            created_By : empId,
            created_At:Date.now()
        });

        await newVariant.save().then(async(response,error)=>{
            if(error){
                return res.status(400).json({
                    success:false,
                    message:"Something is wrong please connect with developer."
                })
            }

            if(response){
                let newImageData =[];
                // for web image
                for(let index=0; index<webImages.length; ++index){
                    let temp={
                        variantId:response._id,
                        published_scope:"Web",
                        url:webImages[index]?.filename,
                        position:index,
                        created_By:empId
                    }
                    newImageData.push(temp);
                }
                // for app image
                for(let index=0; index<appImages.length; ++index){
                    let temp={
                        variantId:response._id,
                        published_scope:"Web",
                        url:appImages[index]?.filename,
                        position:index,
                        created_By:empId
                    }
                    newImageData.push(temp);
                }
                const imageResponse = await insertMany(Image,newImageData);
                if(imageResponse){
                    return res.status(201).json({
                        success:true,
                        message:"Variant added successfully"
                    })
                }else{
                    return res.status(400).json({
                        success:false,
                        message:'Something is wrong please try again.'
                    })
                }
            }
        });
        
    } catch (error) {
        console.log("variant",error)
        return res.status(500).json({
            success:false,
            message:'Internal server error'
        })
    }
}
const addImages = async(req,res) =>{
    const empId = req.empId;
    try {
        const { variantId, published_scope} = req.body;
        const files = req.body.images;
        console.log(files)
        var imageData = [];
        for(let index=0; index<files.length; ++index){
            imageData.push({variantId, published_scope:published_scope, url:files[index], position:index, created_By:empId });
        }
        const savedImage = await insertMany(Image, imageData);

        if(savedImage){
            return res.status(201).json({
                message:"Image Upload Successfully.",
                success:true,
                savedImage
            })
        }
        return res.status(400).json({
            success:false,
            message:'Something is wrong please try again.'
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Internal server error'
        })
    }
}
const showAllColorOfProduct = async(req,res) =>{
    try {

        const select = "color -_id";
        const modelName = Variant;
        const colorList = await find(modelName,select);
        if(colorList){
            return res.status(200).json({
                success:true,
                data:colorList
            });
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Internal server error'
        })
    }
}
const showAllColorOfVariant = async(req,res) =>{
    try {
        const productId = req.query.productId || req.body.productId || req.params.productId ;
        const modelName = Variant;
        const select ="color";
        const condition = { productId}
        const colorList = await find(modelName, select, condition);
        if(colorList){
            return res.status(200).json({
                success:true,
                response:colorList
            })
        }
        return res.status(400).json({

        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Internal server error'
        })
    }
}
const showAllFilters = async(req,res) =>{
    try {
        const {brand, product_type, targetAudience, material,range, discount, size , available, sortBy, rating} = req.query || req.body || req.params;
        const pipeline = [];
        if(brand){
            pipeline.push({
                $match: { brand: {$regex: brand , option:'i'}}
            })
        }
        if(product_type){
            pipeline.push({
                $match:{ product_type : {$regex: product_type, option:'i'}}
            })
        }
        if(targetAudience){
            pipeline.push({
                $match:{targetAudience:{$regex:targetAudience, option:'i'}}
            })
        }
        if(material){
            pipeline.push({
                $match:{material: {regex:material, option:'i'}}
            })
        }
        if(size){
            pipeline.push({
                $match:{size:{$regex:size, option:'i'}}
            })
        }
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:'Something is wrong'
        })
    }
}
const addBrand = async(req,res) =>{
    try {
    const empId = req.empId;
    const {name} = req.body;
    let insertData = [];
    for(let i=0; i<name.length; ++i){
        const temp ={
            created_By:empId,
            name:name[i]
        }
        insertData.push(temp);
    }
    brandResponse = await insertMany(Brand, insertData);
    if(brandResponse){
        return res.status(201).json({
            success:true,
            message:"Brand added successfully."
        })
    }
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:'Something is wrong'
        })
    }
}
const showBrand = async(req,res) =>{
    try {
        const brandList = await find(Brand,"name");
        return res.status(200).json({
            success:true,
            message:"List of all brands.",
            data:brandList
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:'Something is wrong'
        })
    }
}
const test = async(req,res)=>{
    try {
        const webImages = req.files['webImages'] || [];
        const appImages = req.files['appImages'] || [];
        const colorimage = req.files['colorImage'] || [];

        return res.status(200).json({
            success:true,
            webImages,
            appImages,
            colorimage
        })
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
    showProductTitle,
    productDetails,
    addCategory,
    showCategory,
    addSubCategory,
    showSubCategory,
    addSubSubCategory,
    showSubSubCategory,
    incrementSubSubProductSearchCount,
    addVariant,
    addImages,
    showAllColorOfProduct,
    showAllColorOfVariant,
    showAllFilters,
    addBrand,
    showBrand,
    test
}