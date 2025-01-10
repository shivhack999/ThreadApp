require("dotenv").config();
const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require("cors");

require('./config/db/mongoConn.js');
// const {connectMySQL} = require('./config/db/mySqlConn.js');
const userRoutes = require("./routers/user.router");
const empRouters = require("./routers/emp.router");
const productRouter = require('./routers/product.router');
const userActivity = require('./routers/activity.router');
const vendorRouter = require("./routers/vendor.router");
const app = express();
app.use(cors({
    // origin: 'http://localhost:3000', // Replace with your React Native app's URL
    origin: true,
    credentials: true // Allow cookies  
}));
app.use(express.json({ limit: '10mb' })); // Increase limit for JSON payloads
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Increase limit for URL-encoded payloads
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
// connectMySQL();
app.use("/users", userActivity);
app.use('/users',userRoutes);
app.use("/emp", empRouters);
app.use("/product", productRouter);
app.use("/vendor", vendorRouter);





const multer = require("multer");
const router = express.Router();
const fs = require('fs');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, `uploads/test`);
        // Check if the directory exists; if not, create it
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true }); // Create the directory recursively
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  });
  
  const upload = multer({ storage });
  
  // Middleware for parsing JSON
  app.use(express.json());
  
  // API route to create a variant
  app.post('/variant', upload.fields([
    { name: 'colorImage', maxCount: 1 },
    { name: 'webImages', maxCount: 10 },
    { name: 'appImages', maxCount: 10 },
  ]), async (req, res) => {
    try {
      const {
        productId,
        title,
        quantity,
        color,
        order_count,
        material,
        buy_price,
        sale_price,
        max_price,
        min_price,
        discount,
        description,
        size,
        barcode,
        taxable,
        quantity_rule,
        price_currency,
        targetAudience,
        rating,
        created_By,
        updated_By,
      } = req.body;
  
      const colorImage = req.files['colorImage'] ? req.files['colorImage'][0].path : null;
      const webImages = req.files['webImages'] ? req.files['webImages'].map(file => file.path) : [];
      const appImages = req.files['appImages'] ? req.files['appImages'].map(file => file.path) : [];

      res.status(201).json({ message: 'Variant created successfully', colorImage,webImages,appImages, body:req.body});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating variant', error });
    }
  });












app.get('/', (req, res) => {
    res.send('Hello, World!');
});
app.get('/set-cookie', (req, res) => {
    res.cookie('sessionId', 'abc123', {
        domain: process.env.IP_ADDRESS, // Replace with your server's IP address
        path: '/',
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
        sameSite: 'Lax', // Adjust based on your needs
    });
    res.send('Cookie has been set');
  });
const port = 8080;
app.listen(port, () => {
    console.log(`server is running ${port}`);
})

