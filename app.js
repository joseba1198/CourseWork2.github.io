const express = require("express");
const app = express();
const path = require('path');
const fs = require('fs');


//Logger Middleware
app.use(function(request,response, next){
    console.log(request.method + request.url); //console logs the Method and the URL request
    next(); //Next middleware

})

//static image middleware
app.use(function(req, res, next) {
    var filePath = path.join(__dirname, "public" , req.url); // finds the path that the image files are.
    fs.stat(filePath, function(err, fileInfo) { // info about the file
    if (err) {
    next();
    return;
    }
    if (fileInfo.isFile()) res.sendFile(filePath);
    else next();
    });
    });
    

app.listen(3000, () => {
    console.log("app listens on port 3000");
});