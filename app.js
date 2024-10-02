require("dotenv").config();
const express = require("express");
const cors = require("cors");
require('./db/conn');
const app = express();
const userRoutes = require("./routers/user.router");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use('/users',userRoutes);

const port = 8080;
app.listen(port, ()=>{
    console.log(`server is running ${port}`);
})
