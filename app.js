const express = require("express");
const app = express();
const path = require('path');


//Logger Middleware
app.use(function(request,response, next){
    console.log(request.method + request.url); //console logs the Method and the URL request
    next(); //Next middleware

})

app.listen(3000, () => {
    console.log("app listens on port 3000");
});