const express = require("express");
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser')

const MongoClient = require('mongodb').MongoClient;


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

//connection to Mongodatabase
let db;
MongoClient.connect('mongodb+srv://JV284:JV1198@coursework2.ddgg2.mongodb.net/webstore?retryWrites=true/'
, (err, Client) => {
db = Client.db ('webstore')
})




//GET mongo db collection names
app.use(express.json());

app.param('collectionName', (req, res, next, collectionName) =>
{
    req.collection = db.collection(collectionName);
    return next();
})


 //GET routes

 app.get('/', (req, res, next ) =>
 {
     res.send('Select a collection, For example /Lessons ')
 })

 
//GET Route that returns all lessons
app.get('/lessons', (req, res) => {
    db.collection('Lessons').find().toArray((e, results) => {
        if (e) return next(e)
        res.send(results) })
    
  })

  //Post To order

  app.post('/order', (req, res, next) => { //add next
      db.collection('order').insertOne(req.body, (e, results) =>
      { if (e) return next (e)
      res.send(results.ops)
  })
  })

  
app.listen(3000, () => {
    console.log("app listens on port 3000");
});