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

