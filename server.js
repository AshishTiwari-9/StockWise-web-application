// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
var aes = require('aes-ecb');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.listen(3000, function() {
  console.log("Server is running on port 3000.");
});

mongoose.connect("mongodb://localhost:27017/stockDB", {useNewUrlParser: true});

const db_schema = new mongoose.Schema({amt: String, ent1: String, ent2: String, ent3: String, maxloss: String,
sl1: String, sl2: String, sl3: String, qty1: String, qty2: String, qty3: String});
const Record = mongoose.model("Record", db_schema);
var keyString = '-KaPdSgVkYp3s6v8y/B?E(H+MbQeThWm';      // Encryption and Decryption key for AES-256

app.get("/", function(req, res) {
  res.sendfile(__dirname + "/public/index.html");
});

app.get("/moneymgmt", function(req, res) {
  res.sendFile(__dirname + "/public/moneymgmt.html");
});

app.post("/moneymgmt", function(req, res) {
  var amt = req.body.amt;
  var maxloss = (5 / 100) * amt;
  var ent1 = req.body.ent1;
  var ent2 = req.body.ent2;
  var ent3 = req.body.ent3;

  var sl1 = ent1 - ((5 / 100) * ent1).toFixed(2);
  var sl2 = ent2 - ((5 / 100) * ent2).toFixed(2);
  var sl3 = ent3 - ((5 / 100) * ent3).toFixed(2);

  var qty1 = Math.floor(maxloss / sl1);
  var qty2 = Math.floor(maxloss / sl2);
  var qty3 = Math.floor(maxloss / sl3);

  const doc = new Record({amt: aes.encrypt(keyString, amt.toString()), ent1: aes.encrypt(keyString, ent1.toString()),
  ent2: aes.encrypt(keyString, ent2.toString()), ent3: aes.encrypt(keyString, ent3.toString()),
  maxloss: aes.encrypt(keyString, maxloss.toString()),
  sl1: aes.encrypt(keyString, sl1.toString()), sl2: aes.encrypt(keyString, sl2.toString()),
  sl3: aes.encrypt(keyString, sl3.toString()), qty1: aes.encrypt(keyString, qty1.toString()),
  qty2: aes.encrypt(keyString, qty2.toString()), qty3: aes.encrypt(keyString, qty3.toString())});

  doc.save();

  res.write('<h1>Stock 1 ==> Buy quantity: ' + qty1 + ' at ' + ent1 + ' price and Stop loss at: ' + sl1 + '</h1>');
  res.write('<h1>Stock 2 ==> Buy quantity: ' + qty2 + ' at ' + ent2 + ' price and Stop loss at: ' + sl2 + '</h1>');
  res.write('<h1>Stock 3 ==> Buy quantity: ' + qty3 + ' at ' + ent3 + ' price and Stop loss at: ' + sl3 + '</h1>');
  res.end();
});

app.get("/riskmgmt", function(req, res) {
  res.sendFile(__dirname + "/public/riskmgmt.html");
});

app.post("/riskmgmt", function(req, res) {
  var gain1 = parseFloat(req.body.gain1) / 100;
  var gain2 = parseFloat(req.body.gain2) / 100;
  var gain3 = parseFloat(req.body.gain3) / 100;

  var probab1 = parseFloat(req.body.probab1);
  var probab2 = parseFloat(req.body.probab2);
  var probab3 = parseFloat(req.body.probab3);

  var loss1 = parseFloat(req.body.loss1) / 100;
  var loss2 = parseFloat(req.body.loss2) / 100;
  var loss3 = parseFloat(req.body.loss3) / 100;

  var lprobab1 = parseFloat(req.body.lprobab1);
  var lprobab2 = parseFloat(req.body.lprobab2);
  var lprobab3 = parseFloat(req.body.lprobab3);

  var exp1 = (((gain1 * probab1) - (loss1 * lprobab1)) * 100).toFixed(2);
  var exp2 = (((gain2 * probab2) - (loss2 * lprobab2)) * 100).toFixed(2);
  var exp3 = (((gain3 * probab3) - (loss3 * lprobab3)) * 100).toFixed(2);

  res.write('<h1>The expectancy of trade for stock 1 is: ' + exp1 + '%</h1>');
  res.write('<h1>The expectancy of trade for stock 2 is: ' + exp2 + '%</h1>');
  res.write('<h1>The expectancy of trade for stock 3 is: ' + exp3 + '%</h1>');
  res.end();
});

app.get("/stockDB_read", function(req, res) {
  res.write('<p> Data stored in the database stockDB: </p>');
  Record.find(function(err, items){
  	if (err) {
  		console.log(err);
  	} else {
  		items.forEach(function(item) {
        res.write('<p> -------------------------------------------------------------------------------------------- </p>');
        res.write('<p> Encrypted amount: ' + item.amt + '</p>');
  			res.write('<p> Decrypted amount: ' + aes.decrypt(keyString, item.amt) + '</p>');

        res.write('<p> Encrypted maximum loss: ' + item.maxloss + '</p>');
  			res.write('<p> Decrypted maximum loss: ' + aes.decrypt(keyString, item.maxloss) + '</p>');

        res.write('<p> Encrypted entry price for stock 1: ' + item.ent1 + '</p>');
  			res.write('<p> Decrypted entry price for stock 1: ' + aes.decrypt(keyString, item.ent1) + '</p>');
        res.write('<p> Encrypted entry price for stock 2: ' + item.ent2 + '</p>');
  			res.write('<p> Decrypted entry price for stock 2: ' + aes.decrypt(keyString, item.ent2) + '</p>');
        res.write('<p> Encrypted entry price for stock 3: ' + item.ent3 + '</p>');
  			res.write('<p> Decrypted entry price for stock 3: ' + aes.decrypt(keyString, item.ent3) + '</p>');

        res.write('<p> Encrypted stoploss for stock 1: ' + item.sl1 + '</p>');
  			res.write('<p> Decrypted stoploss for stock 1: ' + aes.decrypt(keyString, item.sl1) + '</p>');
        res.write('<p> Encrypted stoploss for stock 2: ' + item.sl2 + '</p>');
  			res.write('<p> Decrypted stoploss for stock 2: ' + aes.decrypt(keyString, item.sl2) + '</p>');
        res.write('<p> Encrypted stoploss for stock 3: ' + item.sl3 + '</p>');
  			res.write('<p> Decrypted stoploss for stock 3: ' + aes.decrypt(keyString, item.sl3) + '</p>');

        res.write('<p> Encrypted quantity for stock 1: ' + item.qty1 + '</p>');
  			res.write('<p> Decrypted quantity for stock 1: ' + aes.decrypt(keyString, item.qty1) + '</p>');
        res.write('<p> Encrypted quantity for stock 2: ' + item.qty2 + '</p>');
  			res.write('<p> Decrypted quantity for stock 2: ' + aes.decrypt(keyString, item.qty2) + '</p>');
        res.write('<p> Encrypted quantity for stock 3: ' + item.qty3 + '</p>');
  			res.write('<p> Decrypted quantity for stock 3: ' + aes.decrypt(keyString, item.qty3) + '</p>');
        res.write('<p> -------------------------------------------------------------------------------------------- </p>');
  		});
      // console.log(items);
      res.end();
  	}
  });
});
