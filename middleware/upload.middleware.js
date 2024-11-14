// middlewares/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Function to create a dynamic multer storage configuration
const getMulterStorage = (uploadPath) => {
  let fullPath;
  return multer.diskStorage({
    destination: (req, file, cb) => {
      fullPath = path.join(__dirname, '../uploads', uploadPath);
      req.body.images = uploadPath + "/" +Date.now() + '-' + file.originalname;
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
