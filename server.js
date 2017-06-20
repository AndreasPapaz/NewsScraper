var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var favicon = require("serve-favicon");
var PORT = process.env.PORT || 3000;

//Requiring the article model
var Article = require("./models/Article.js");

//Scrapping tools
var request = require("request");
var cheerio = require("cheerio");

//Set mongoose to leverare buitl in JS ES6 promises
mongoose.Promise = Promise;

//INIT express
var app = express();

// use morgan and body parser
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json({
    type: "application/vnd.api+json"
}));
app.use(express.static(__dirname + '/public/assets'));
app.use(favicon(__dirname + "/public/img/favicon.ico"));

//Make public a static dir
app.use(express.static("public"));

// Handlebars set up
app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

// DB config with mongoose
mongoose.connect("mongodb://heroku_bld1v7lc:a7gtfn7un0hsua6e3jvf9pq2pr@ds131312.mlab.com:31312/heroku_bld1v7lc");
// mongoose.connect("mongodb://localhost/newscrapper");
var db = mongoose.connection;

//show any mongoose err
db.on("error", function(error) {
	console.log("MONGOOSE ERROR: ", error);
});

//Once logged into the db through mongoose, message longon succuess
db.once("open", function() {
	console.log("MONGOOSE CONNECTION SUCCESSFUL!");
});


// ROUTES
//pass routes and scrapper in the router.js
var routes = require("./routes/routes.js");
app.use("/", routes);

//LISTEN ON PORT
app.listen(PORT, function() {
	console.log("App running on port " + PORT);
});