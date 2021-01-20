//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const fs = require("fs");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req,res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req,res){
  const symbol = req.body.symbol;
  fs.readFile('secrets/api-key.txt', 'utf8', function(err, data){
    if (err) { throw err; }
    const api_key = data;
    const url = "https://sandbox.iexapis.com/stable/stock/" + symbol + "/quote/latestPrice?token=" + api_key;

    https.get(url, function(response){
      response.on("data", function(latestPrice){
        res.send(symbol.toUpperCase() + "'s Latest Price: "+ JSON.parse(latestPrice));
      });
    });
  });
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});
