//This page is used for Logging in the Application.
var express = require("express");
var router = express.Router();
const lib = require("./readwrite");
const fs = require('fs');

const credential = {
    email : "admin@gmail.com",
    password : "admin123"
}

//Router.post() submits the data whereas router.get() requests the data.
// login user
//  router.post('/login', (req, res)=>{
//     credential.email = req.body.email;
//     credential.password = req.body.password;
    
//     const result =  lib.main(credential);

//     if(req.body.email == credential.email && req.body.password == credential.password){

//         req.session.user = req.body.email;
//         //res.redirect('/route/dashboard');
//         res.redirect('/route/index');        
//         //res.end("Login Successful...!");
//     }
//     else{
//         //res.end() function is used to end the response process.
//         res.end("Invalid Username")
//     }
// });

router.post('/login', async (req, res)=>{
    credential.email = req.body.email;
    credential.password = req.body.password;    
    const result =  await lib.main(credential);

    if (typeof result !== 'undefined' && result !== null)
    {
        if (result.length!=0)
        {
            if(req.body.email == result[0].email && req.body.password == result[0].password){

                req.session.user = result[0].email;
                req.session.room = result[0].room;
                req.session.policeveriCert = result[0].policeveriCert;
                req.session.washSubscription = result[0].washSubscription;
                req.session.monthlyRent = result[0].monthlyRent;
                req.session.security = result[0].security;
                req.session.rentAggrement = result[0].rentAggrement;
                req.session.returnItems = result[0].returnItems;
                //res.redirect('/route/dashboard');
                res.redirect('/route/index');                        
                //res.end("Login Successful...!");
            }
            else{
                //res.end() function is used to end the response process.
                res.end("Invalid Username")
            }
        }
        else{
            res.end("Invalid Username")
            }
    }
    else{
        res.end("Invalid Username")
    }
});


// route for dashboard
router.get('/dashboard', (req, res) => {
    if(req.session.user){
        res.render('dashboard', {user : req.session.user})
    }
    else{
        //res.send("Unauthorize User")
        res.render('unauthorized')
    }
})

// route for index
router.get('/index', (req, res) => {
    if(req.session.user){
        res.render('index', {user : req.session.user})
    }
    else{
        res.send("Unauthorize User")
    }
})

// route for logout
router.get('/logout', (req ,res)=>{
    req.session.destroy(function(err){
        if(err){
            console.log(err);
            res.send("Error")
        }
        else{
            res.render('base', { title: "Login System", logout : "logout Successfully...!"})
        }
    })
})

router.get('/downloadPVCfile/:filename', async(req, res) => {   
    const filename_ = req.params.filename;
    const filePath = `${__dirname}/public/data/PVC/${filename_}`;

    fs.readFile(filePath, (err, file) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Could not download file');
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="PoliceVerification.pdf"');
        res.send(file);
    });    
});
router.get('/downloadTermCondfile/:filename', async(req, res) => {   
    const filename_ = req.params.filename;
    const filePath = `${__dirname}/public/data/TermCondition/${filename_}`;

    fs.readFile(filePath, (err, file) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Could not download file');
        }
        res.setHeader('Content-Type', 'application/image');
        res.setHeader('Content-Disposition', 'attachment; filename="TermCondition_U_80_7.jpg"');
        res.send(file);
    });    
});
router.get('/downloadTermCondpdf/:filename', async(req, res) => {   
    const filename_ = req.params.filename;
    const filePath = `${__dirname}/public/data/TermCondition/${filename_}`;

    fs.readFile(filePath, (err, file) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Could not download file');
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="TermCondition_U_80_7.pdf"');
        res.send(file);
    });    
});
module.exports = router;