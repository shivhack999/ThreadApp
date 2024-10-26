const mongoose = require('mongoose');
const permissionSchema = new mongoose.Schema({
    role: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role', required: true 
    }, // Reference to Role model
    moduleName: { 
        type: String, 
        required: true 
    }, // e.g., 'Product Management'
    action: { 
        type: String, 
        required: true 
    }, // e.g., 'create', 'read', 'update', 'delete'
    hasAccess: { 
        type: Boolean, 
        default: false 
    } // Access control
});

const Permission = mongoose.model('Permission', permissionSchema);
module.exports = Permission;
