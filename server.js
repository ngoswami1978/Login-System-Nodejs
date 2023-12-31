// (A) LOAD REQUIRED MODULES
//uuid will create a random view id for your session variable.
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require("fs");
const glob = require("glob");
//const lib = require("./readwrite");
const session = require('express-session');
const {v4 : uuidv4} = require('uuid');
const router = require('./router');

// (B) INIT EXPRESS SERVER
const app = express();
//Specifying the port value.
const port = process.env.PORT || 3000;
//Using Body Parser.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
//app.set() function is used to assigns the setting name to value.
app.set('view engine','ejs');
//Informing server about CSS file.(Linking styles.css to server.js)
app.use('/static',express.static(path.join(__dirname,'public')))
//Informing server about assets.(Linking the background image in assets folder)
app.use('/assets',express.static(path.join((__dirname,'public/assets'))))

app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true
}));
app.use('/route',router);

// (C) GET IMAGES
var images = glob.sync("gallery/**/*.{jpg,jpeg,png,webp,gif}");
var names = [];
images.forEach
(
    img => names.push(path.parse(img).name)    
);

// (D) GALLERY IMAGES & PAGE
app.use("/public", express.static(path.join(__dirname, "public")))
app.use("/gallery", express.static(path.join(__dirname, "")))
app.get("/gallery", (req, res) => 
    res.render("2a-gallery.ejs" , 
    {
        images: images
        , names: names 
    }));

//const result = lib.main();
//Home Route.
//res.render() function is used to render a view and sends the rendered HTML string to the client. 
app.get('/', (req,res) =>{
    res.render('base',{title:"Login System"});
})

//Starting the server.
app.listen(port, () => {
    console.log("Listening to the server on: http://localhost:3000");
})