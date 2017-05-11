var express = require("express");
var bodyParser = require("body-parser");
var mongoose    = require('mongoose');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

var config = require('./config'); // get our config file    

require("./routes/routes.js")(app);
app.listen(3000);

mongoose.connect(config.database);
