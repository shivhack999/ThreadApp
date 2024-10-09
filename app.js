require("dotenv").config();
const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require("cors");
require('./config/db/mongoConn.js');
const {connectMySQL} = require('./config/db/mySqlConn.js');
const userRoutes = require("./routers/user.router");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
connectMySQL();

app.use('/users',userRoutes);

const port = 8080;
app.listen(port, () => {
    console.log(`server is running ${port}`);
})

