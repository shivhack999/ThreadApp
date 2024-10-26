// middlewares/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Function to create a dynamic multer storage configuration
const getMulterStorage = (uploadPath) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const fullPath = path.join(__dirname, '../uploads', uploadPath);

      // Create directory if it doesn't exist
      fs.mkdirSync(fullPath, { recursive: true });
      cb(null, fullPath); // Use dynamic path for destination
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });
};

// Function to initialize multer with dynamic storage
const dynamicUpload = (uploadPath) => {
  return multer({
    storage: getMulterStorage(uploadPath),
  }).array('images', 5); // Allows up to 5 images at once
};

module.exports = dynamicUpload;
