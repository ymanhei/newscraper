// Using the tools and techniques you learned so far,
// you will scrape a website of your choice, then place the data
// in a MongoDB database. Be sure to make the database and collection
// before running this exercise.

// Consult the assignment files from earlier in class
// if you need a refresher on Cheerio.

// Dependencies
var express = require("express");
//var mongojs = require("mongojs");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var logger = require("morgan");
var path = require("path");
var moment = require("./public/js/moment.js");
// Initialize Express
var app = express();

// Database configuration
//var databaseUrl = "scraper";
//var collections = ["scrapedData"];
//var db = require("./models");
var News = require("./models/newsModel.js");

app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static(path.join(__dirname, '/public')));

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
var MONGODB_URI = "mongodb+srv://admin:admin@cluster0-eg6gd.mongodb.net/test?retryWrites=true&w=majority" || "mongodb://localhost/newsdb";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


var dbresults = [];

/* // Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
}); */

var siteurl = "https://www.abc.net.au/news/justin/";

axios.get(siteurl).then(function(response) {
  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(response.data);

  // An empty array to save the data that we'll scrape
  var results = [];
  
  // Select each element in the HTML body from which you want information.
  // NOTE: Cheerio selectors function similarly to jQuery's selectors,
  // but be sure to visit the package's npm page to see how it works
  $("ul.article-index li").each(function(i, element) {
/*     console.log("---------------------------------------------------------------");
    console.log($(element).children("h3").children("a").text());
    console.log($(element).children("h3").children("a").attr("href"));
    console.log($(element).children("p:not([class])").text());
    console.log($(element).children("p:not([class])").text());
    console.log("---------------------------------------------------------------"); */

    let headline = $(element).children("h3").children("a").text();
    let url = siteurl + $(element).children("h3").children("a").attr("href");
    let content = $(element).children("p:not([class])").text();
    let newstime = $(element).children(".published").children("span:first-child").text();
    //var title = $(element).children().children().children("h3").children("a").text();
   // var link = $(element).children().children().children("h3").children("a").attr("href");
    //console.log("-------------------"+newstime);
    //console.log("-------------------"+link);
    // Save these results in an object that we'll push into the results array we defined earlier
      results.push({
      headline: headline,
      url: url,
      content:content,
      newstime:newstime
    });  
  });

  // Log the results once you've looped through each of the elements found with cheerio
  
  dbresults = results;
  //console.log("1:          "+dbresults);
  require("./routes/html-routes.js")(app,dbresults);
  //console.log("2:          "+dbresults);
});





// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
