const express = require('express');
const path = require('path');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "../public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

const connectDB = require("../config/db");
connectDB();

const adminRoutes = require("../routes/admin.routes");
app.use("/admin", adminRoutes);

const categoryRoutes = require("../routes/category.routes");
app.use("/admin/categories", categoryRoutes);

const imageRoutes = require("../routes/image.routes");
app.use("/image", imageRoutes);

const homeRoutes = require("../routes/home.routes");
app.use("/", homeRoutes);

app.get('/pages/about',function(req,res){
    res.render('pages/about');
})
app.get('/pages/contact',function(req,res){
    res.render('pages/contact');
})
app.get('/pages/privacy',function(req,res){
    res.render('pages/privacy');
})
app.get('/pages/terms',function(req,res){
    res.render('pages/terms');
})
app.get('/pages/dmca',function(req,res){
    res.render('pages/dmca');
})

module.exports = app;
