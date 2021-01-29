const express = require("express");
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser')

const MongoClient = require('mongodb').MongoClient;

const ObjectID = require('mongodb').ObjectID;



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

    app.use(function(req, res, next) {
         res.header("Access-Control-Allow-Origin", "*");
         res.header("Access-Control-Allow-Headers", "*");
         res.header("Access-Control-Allow-Methods", "*");
        next();
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
app.get('/lessons', (req, res, next) => {
    db.collection('Lessons').find().toArray((e, results) => {
        if (e) return next(e)
        res.send(results) })
    
  })
//Get one lesson
  app.get('/collection/:collectionName/:id'
, (req, res, next) => {
req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {
if (e) return next(e)
res.send(result)
})
})

  //Post To order

  app.post('/order', (req, res, next) => { 
      console.log('order');
      db.collection('order').insertOne(
        req.body , (e, results) =>
      { if (e) return next (e)
      res.send(results.ops)
  })
  })
  
  //Put to update spaces

  app.put('/collection/:collectionName/:id'
, (req, res, next) => { 
    console.log(JSON.stringify(req.body));
    console.log(JSON.stringify(req.collection));
    console.log(req.id)
req.collection.update(
{_id: new ObjectID(req.params.id)},
{$set: req.body},
{safe: true, multi: false},
(e, result) => {
if (e) return next(e)
res.send((result.result.n === 1) ? {msg: 'success'} : {msg: 'error'})
})
})

  

const port = process.env.PORT || 3000
app.listen(port)
