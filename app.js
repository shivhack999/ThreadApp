require("dotenv").config();
const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require("cors");
require('./config/db/mongoConn.js');
// const {connectMySQL} = require('./config/db/mySqlConn.js');
const userRoutes = require("./routers/user.router");
const empRouters = require("./routers/emp.router");
const productRouter = require('./routers/product.router');
const userActivity = require('./routers/activity.router');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
// connectMySQL();
app.use("/users", userActivity);
app.use('/users',userRoutes);
app.use("/emp", empRouters);
app.use("/product", productRouter);

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

const port = 8080;
app.listen(port, () => {
    console.log(`server is running ${port}`);
})

