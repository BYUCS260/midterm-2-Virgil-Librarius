const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
/*global upload*/
app.use(express.static('public'));

const mongoose = require('mongoose');

// Configure multer so that it will upload to '/public/images'
const multer = require('multer')
const upload = multer({
  dest: './public/images/',
  limits: {
    fileSize: 10000000
  }
});

// connect to the database
mongoose.connect('mongodb://localhost:27017/bootlegAmazon', {
  useNewUrlParser: true
});

const itemSchema = new mongoose.Schema({
  name: String,
  path: String,
  price: Number,
  buyNow: Boolean,
  buys: Number,
});
const Item = mongoose.model('Item', itemSchema);

app.post('/api/photos', upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});

app.post('/api/items', async (req, res) => {
  const item = new Item({
    name: req.body.name,
    path: req.body.path,
    price: req.body.price,
    buys: req.body.buys,
    buyNow: req.body.buyNow,
  });
  try {
    await item.save();
    res.send(item);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/items', async (req, res) => {
  try {
    let items = await Item.find();
    res.send(items);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
app.delete('/api/items/:id', async(req,res)=>{
  try {
    var id = req.params.id;
    console.log(id);
    var query = { _id: id };
    Item.deleteOne(query,function(){}); /*function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
  });*/
  } catch (error) {
    console.log(error);
  }
});
app.put('/api/items/:id', async (req, res) => {
  try {
    var id = req.params.id;
    var query = { _id: id };
    var update = { $set: {buys: req.body.buys, buyNow: req.body.buyNow}};
    let item = await Item.updateOne(query, update, function(){});
    res.send(item);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});/*
app.put('/api/items/:id', async (req, res) => {
  try {
    console.log(req.body.name);
    var id = req.params.id;
    var query = { _id: id };
    var update = { $set: {name: req.body.name , price: req.body.price }};
    let item = await Item.updateOne(query, update, function(){});
    res.send(item);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});*/
app.listen(4200, () => console.log('Server listening on port 4200!'));