const {validationResult} = require('express-validator');
const bcrypt = require("bcrypt");
const Employee = require('../../models/emp/emp.model');
const Role = require('../../models/emp/role.model');
const Permission = require('../../models/emp/permission.model');
const Department = require('../../models/emp/department.model');
const comparePassword = require('../../helpers/Common/password/comparePassword');
const generatePassword = require('../../helpers/Common/password/generatePassword');
const generateAccessToken = require('../../helpers/Common/token/accessToken');
const generateRefreshToken = require('../../helpers/Common/token/refreshToken');




const addDepartment = async(req,res)=>{
    try {
        const departments = Array.isArray(req.body) ? req.body : [req.body];

        // Collect all department names from the request body
        const departmentNames = departments.map(dept => dept.department_name);
    
        // Find if any of these departments already exist
        const existingDepartments = await Department.find({
          department_name: { $in: departmentNames }
        });
    
        // Extract existing department names to compare
        const existingNames = existingDepartments.map(dept => dept.department_name);
    
        // Filter out duplicate departments from the request
        const newDepartments = departments.filter(
          dept => !existingNames.includes(dept.department_name)
        );
    
        // If no new departments, respond with a message
        if (newDepartments.length === 0) {
            return res.status(400).json({ 
                success:false,
                message: 'All departments already exist.' 
            });
        }
    
        // Insert the new departments into the database
        const addedDepartments = await Department.insertMany(newDepartments);
        res.status(201).json({ 
            success:true,
            message: 'Departments added successfully', 
            addedDepartments 
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error
        })
    }
}
const showDepartment = async(req,res)=>{
    try {
        const filter = {};
        if (req.query.department_name) {
            filter.department_name = new RegExp(req.query.department_name, 'i'); // case-insensitive match
        }
        const departments = await Department.find(filter);
        if(!departments){
            return res.status(400).json({
                success:true,
                message:'No department found.'
            });
        }
        return res.status(200).json({
            success:true,
            departments
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error
        })
    }
}


const addRole = async(req,res)=>{
    try {
        const roles = req.body.roles;

        if (!roles || !Array.isArray(roles) || roles.length === 0) {
        return res.status(400).json({ 
            success:false,
            message: 'Invalid roles array' 
        });
        }

        const roleNames = roles.map(role => role.role_name);

        // Check for existing roles in the database
        const existingRoles = await Role.find({
        role_name: { $in: roleNames }
        });

        // Extract names of existing roles
        const existingRoleNames = existingRoles.map(role => role.role_name);

        // Find out which roles are new (not already existing)
        const checkDuplicate = roles.filter(role => !existingRoleNames.includes(role.role_name));

        // If there are no new roles to insert, return a message
        if (checkDuplicate.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'All roles already exist.',
                existingRoles: existingRoleNames
            });
        }
        // Insert multiple roles
        const newRoles = await Role.insertMany(roles);
    res.status(201).json({ message: 'Roles added successfully', data: newRoles });
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error
        })
    }
}
const showRole = async(req,res)=>{
    try {
        const { role_name, description } = req.query;
        const filter = {};

        if (role_name) {
        filter.role_name = { $regex: `^${role_name}`, $options: 'i' }; // Case-insensitive search
        }
        if (description) {
        filter.description = { $regex: description, $options: 'i' }; // Case-insensitive search
        }
        const roles = await Role.find(filter); // Fetch roles based on filter
        console.log(roles)
        let roleStatus = true;
        if(roles.length === 0) roleStatus = false;
        const roleStatusValue = (roleStatus)? 200 : 400;
        res.status(roleStatusValue).json({
            success:roleStatus,
            message: (roleStatus)? 'Roles retrieved successfully' : 'No data found!',
            response: roles
        });

    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error
        })
    }
}
const updateRole = async(req,res)=>{
    try {
        const { id } = req.params || req.query; // Get the role ID from the URL
        const { role_name, description } = req.body; // Get the new role data from the request body
    
        // Find the role and update it
        const updatedRole = await Role.findByIdAndUpdate(
          id,
          { role_name, description },
          { new: true, runValidators: true } // Return the updated role and validate
        );
    
        if (!updatedRole) {
          return res.status(404).json({ success:false, message: 'Role not found' });
        }

        res.status(200).json({
          success:true,
          message: 'Role updated successfully',
          data: updatedRole
        });

    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error
        })
    }
}
const deleteRole = async(req,res)=>{
    try {
        const { id } = req.params || req.query || req.body; // Get the role ID from the URL
        // Find the role and delete it
        const deletedRole = await Role.findByIdAndDelete(id);
        if (!deletedRole) {
        return res.status(404).json({ success:false, message: 'Role not found' });
        }
        res.status(200).json({
            success:true,
            message: 'Role deleted successfully',
            data: deletedRole
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error
        })
    }
}


const addPermission = async(req,res)=>{
    try {
        const permissions = req.body.permissions;
        // Validate the input
        if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
          return res.status(400).json({ message: 'Invalid permissions array' });
        }
    
        // Insert multiple permissions
        const newPermissions = await Permission.insertMany(permissions);
    
        res.status(201).json({
          message: 'Permissions added successfully',
          data: newPermissions
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error
        })
    }
}
const showPermission = async(req,res)=>{
    try {
        const { role, moduleName, action } = req.query || req.params;

        const filter = {};
        if (role) filter.role = role; // Filter by role ID
        if (moduleName) {
            filter.moduleName = { $regex: `^${moduleName }`, $options: 'i'};
        }
        if (action) {
          filter.action = {$regex: `^${action}` , $options: 'i'}; // Filter by action type
        }
    
        // Find permissions based on the filter
        const permissions = await Permission.find(filter).populate('role', 'role_name description');
    
        // Check if any permissions were found
        if (permissions.length === 0) {
          return res.status(404).json({ success:false, message: 'No permissions found matching the criteria.' });
        }
    
        // Return the permissions
        res.status(200).json({
          success:true,
          message: 'Permissions retrieved successfully.',
          data: permissions
        });

    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error
        })
    }
}
const updatePermission = async(req,res)=>{
    try {
        const { id } = req.params || req.query; // Extract permission ID from URL
        const { role, moduleName, action, hasAccess } = req.body; // Extract new data from request body
    
        // Validate the provided ID
        if (!mongoose.isValidObjectId(id)) {
          return res.status(400).json({ message: 'Invalid permission ID.' });
        }
    
        // Build the update object
        const updateData = {};
        if (role) updateData.role = role; // Update role if provided
        if (moduleName) updateData.moduleName = moduleName; // Update moduleName if provided
        if (action) updateData.action = action; // Update action if provided
        if (typeof hasAccess !== 'undefined') updateData.hasAccess = hasAccess; // Update hasAccess if provided
    
        // Find and update the permission by ID
        const updatedPermission = await Permission.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    
        // Check if the permission was found and updated
        if (!updatedPermission) {
          return res.status(404).json({success:false, message: 'Permission not found.' });
        }
    
        // Return the updated permission
        res.status(200).json({
          success:true,
          message: 'Permission updated successfully.',
          response: updatedPermission
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error
        })
    }
}
const deletePermission = async(req,res)=>{
    try {
        const { id } = req.params || req.query; // Extract permission ID from URL

    // Validate the provided ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid permission ID.' });
    }

    // Find and delete the permission by ID
    const deletedPermission = await Permission.findByIdAndDelete(id);

    // Check if the permission was found and deleted
    if (!deletedPermission) {
      return res.status(404).json({ message: 'Permission not found.' });
    }
    // Return a success message
    res.status(200).json({
      message: 'Permission deleted successfully.',
      data: deletedPermission
    });
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error
        })
    }
}


const login =  async(req,res) =>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(500).json({
                success:false,
                errors:errors.array()
            })
        }
        const {email, password} = req.body;

        const employeeData = await Employee.findOne({email}).exec();
        // console.log(userData)
        if(!employeeData){
            return res.status(400).json({
                success:false,
                response:"Email id not register?" 
            });
        }
        const passwordMatch = await comparePassword(password, employeeData.password);
        if (!passwordMatch) {
            return res.status(400).json({ 
                success:false,
                response: 'Email id and password is Incorrect!'
            });
        }
        if(employeeData.active === false){
            return res.status(400).json({ 
                success:false,
                response: 'Your account is temporary blocked please connect with IT Department.'
            });
        }
        const accessToken = await generateAccessToken({employeeData:employeeData});
        const refreshToken = await generateRefreshToken({employeeData:employeeData._id});
        await Employee.findByIdAndUpdate(
            employeeData._id,
            {$set:{refreshToken:refreshToken}},
            {new:true}
        ) 
        const responseEmpData = await Employee.findById(employeeData._id).select("-password -create_At -refreshToken -__v");
        const option ={
            httpOnly:true,
            secure:true,
            sameSite:'strict'
        }
        return res.status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json({
            success:true,
            response:"User Login Successfully",
            empData:responseEmpData,
            tokenType: 'Bearer',
            refreshToken:refreshToken
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success:false,
            response:error
        })
    }
}
const register = async(req,res) =>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(500).json({
                success:false,
                errors:errors.array()
            })
        }
        const { name, mobile, email, gender, hire_date, department, roles, password } = req.body;
        
        let existingEmployee = await Employee.findOne({ $or: [{ email }, { mobile }] });
        if (existingEmployee) {
            return res.status(400).json({success:false, message: "Employee with this email or mobile already exists." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new employee instance
        const employee = new Employee({
            name,
            mobile,
            email,
            gender,
            hire_date,
            department,
            roles,
            password: hashedPassword
        });

        await employee.save();
        return res.status(201).json({
            success:true,
            message: "Employee registered successfully.",
            employee: {
                email,
                password
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success:false,
            response:error
        })
    }
}
const changePassword = async(req,res) =>{
    try {
        const id = req.empID;
        const {oldPassword, newPassword} = req.body;
        const employeeData = await Employee.findById(id);
        const passwordMatch = await comparePassword(oldPassword, employeeData.password);
        if (!passwordMatch) {
            return res.status(400).json({ 
                success:false,
                response: 'Old password is Incorrect!'
            });
        }
        const hashedPassword = await generatePassword(newPassword);
        employeeData.password = hashedPassword;
        await employeeData.save();
        return res.status(201).json({
            success:true,
            message:'Password has been changed successfully.'
        }); 
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error
        })
    }
}
const logout = async(req,res) =>{
    try {
        const id = req.empID;
        const isUpdate = await Employee.findByIdAndUpdate(id,{$set:{refreshToken:undefined}},{new:true});
        if(!isUpdate){
            return res.status(400).json({
                success:false,
                message:'something is wrong please try again.'
            })
        }
        const option ={
            httpOnly:true,
            secure:true,
            sameSite:'strict'
        }
        res.status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json({
            success:true,
            message:"Employee Logout successfully."
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            response:error
        }) 
    }
}
module.exports = {
    addDepartment,
    showDepartment,

    addRole,
    showRole,
    updateRole,
    deleteRole,

    addPermission,
    showPermission,
    updatePermission,
    deletePermission,

    login,
    register,
    changePassword,
    logout
}



// const  = async(req,res)=>{
//     try {
        
//     } catch (error) {
//         return res.status(400).json({
//             success:false,
//             response:error
//         })
//     }
// }