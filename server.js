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
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsdb";
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
  //console.log(dbresults);
});



// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  var r = [];
  News.find({saved:false}).sort({newstime: -1})
     //Sort by Date Added DESC

 .then(function(dbNews) {
   // If all Notes are successfully found, send them back to the client
   dbNews.forEach(function(element){ 
    //console.log("element"+element)
    r.push({
      id: element.id,
      headline: element.headline,
      url: element.url,
      content:element.content,
      newstime:element.newstime
  }); 
}); 
//console.log("DATA:   " + r);
   var data = {
    news: r
  };
  //console.log(data);
  res.render("index",data);
 })
 .catch(function(err) {
   // If an error occurs, send the error back to the client
   res.json(err);
 });
});

app.get("/saved", function(req, res) {
  var r = [];
  News.find({saved:true})
 .then(function(dbNews) {

   // If all Notes are successfully found, send them back to the client
   dbNews.forEach(function(element){ 
    //console.log("element"+element)
    r.push({
      id: element.id,
      headline: element.headline,
      url: element.url,
      content:element.content,
      newstime:element.newstime
  }); 
}); 
//console.log("DATA:   " + r);
   var data = {
    saves: r
  };

  //console.log(data);
  
  res.render("saves",data);

 })
 .catch(function(err) {
   // If an error occurs, send the error back to the client
   res.json(err);
 });
});

app.get("/putsave/:id", function(req, res) {
  News.findOneAndUpdate({_id:req.params.id},{$set:{saved:true}})
  .then(
    res.redirect('/')
  )
});

app.get("/removesave/:id", function(req, res) {
  News.findOneAndUpdate({_id:req.params.id},{$set:{saved:false}})
  .then(
    res.redirect('/saved')
  )
});

// TODO: make two more routes

// Route 1
// =======
// This route will retrieve all of the data
// from the scrapedData collection as a json (this will be populated
// by the data you scrape using the next route)
app.get("/all", function(req, res) {
 // Find all Notes
 News.find({})
 .then(function(dbNews) {
   // If all Notes are successfully found, send them back to the client
   res.json(dbNews);
 })
 .catch(function(err) {
   // If an error occurs, send the error back to the client
   res.json(err);
 });
});
// Route 2
// =======
// When you visit this route, the server will
// scrape data from the site of your choice, and save it to
// MongoDB.
// TIP: Think back to how you pushed website data
// into an empty array in the last class. How do you
// push it into a MongoDB collection instead?

/* -/-/-/-/-/-/-/-/-/-/-/-/- */

app.get("/scrape", function(req, res) {
   
dbresults.forEach(function (elements){
  var query  = News.where({ url: elements.url });
  query.findOne(function (err, n) {
   if (err) return handleError(err);
   if (!n) {
    News.create(elements)
    .then(function(dbNews) {
      // If saved successfully, send the the new User document to the client
      //res.json(dbNews);
      
    })
    .catch(function(err) {
      // If an error occurs, send the error to the client
      res.json(err);
    });
  }

});
})
setTimeout(function(){
  // Move to a new location or you can do something else
  res.redirect('/');
}, 3000);
    
  });

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
