const Vendor = require("../../models/vendor/vendor.model");
const find = require("../../utils/query/find");
const add = async(req,res) =>{
    try {
        const empId=req.empId;
        const { name, contact, email, location } = req.body;
        if (!name || !contact || !email) {
            return res.status(400).json({
                success:false, 
                message: "Name, contact, email, and created_By are required fields." 
            });
        }
        const newVendor = new Vendor({
            name,
            contact,
            email,
            location,
            created_By:empId
        });
        const response = await newVendor.save();
        if(response)
            return res.status(201).json({ 
                success:true, 
                message: "Vendor created successfully", 
                vendor: newVendor 
            });
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"Something is wrong please connect with developer"
        })
    }
}
const show = async(req,res)=>{
    try {
        
        const response = await find(Vendor,"name");
        return res.status(200).json({
            success:true,
            data:response
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"Something is wrong please connect with developer"
        })
    }
}
module.exports={
    add,
    show
}