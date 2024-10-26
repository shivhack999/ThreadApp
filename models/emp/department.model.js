const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  department_name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  }
});

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;