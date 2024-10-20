require("dotenv").config();
const mongoose = require("mongoose");
const db_pass = process.env.DB;
// console.log(db_pass);
const DB = `mongodb+srv://shivhack999:${db_pass}@cluster0.mhmsojf.mongodb.net/XApp?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(DB, {
    useNewUrlParser: true,
}).then(() => console.log("connection to MongoDB")).catch((error) => console.log(error.message));